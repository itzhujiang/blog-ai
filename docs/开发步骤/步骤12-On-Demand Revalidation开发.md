# 步骤12：On-Demand Revalidation 开发

## 步骤信息

- **步骤序号**：12 / 12
- **关联 PRD 功能**：4.3.2 数据获取策略 - ISR 配合 On-Demand Revalidation
- **前置步骤**：步骤4（首页开发）、步骤5（文章列表页开发）、步骤6（文章详情页开发）
- **预计工作量**：简单

---

## 一、步骤目标

实现 On-Demand Revalidation API，使后台管理系统在发布、更新或删除文章时能主动触发 Next.js ISR 缓存刷新，确保用户及时看到最新内容。具体包括：

1. 创建按需重新验证 API 接口（`/api/revalidate`）
2. 支持按路径（path）精确刷新指定页面缓存
3. 使用密钥（secret token）进行身份验证，防止未授权调用
4. 支持批量刷新多个路径

---

## 二、需求说明

### 2.1 功能要求

- 后台管理系统发布/更新/删除文章后，调用 Revalidation API 刷新相关页面缓存
- 支持刷新指定文章详情页（`/articles/[slug]`）
- 支持刷新文章列表页（`/articles`）
- 支持刷新首页（`/`）
- 支持一次请求刷新多个路径
- API 需要密钥验证，防止恶意调用

### 2.2 业务规则

- **发布新文章**：刷新首页 + 文章列表页
- **更新文章内容**：刷新首页 + 文章列表页 + 该文章详情页
- **删除文章**：刷新首页 + 文章列表页
- **更新分类**：刷新首页 + 文章列表页
- 密钥通过环境变量 `REVALIDATION_SECRET` 配置
- 未提供密钥或密钥错误时返回 401

### 2.3 调用场景

后台管理系统（独立项目）在以下操作后调用此 API：

```
后台发布文章 → 保存到数据库 → POST /api/revalidate
  → Next.js 清除相关页面 ISR 缓存
  → 下次用户访问时重新生成页面
```

---

## 三、技术实现指引

### 3.1 涉及文件

| 文件路径 | 操作类型 | 说明 |
|---------|---------|------|
| `app/api/revalidate/route.ts` | 新增 | On-Demand Revalidation API |
| `.env` | 修改 | 添加 `REVALIDATION_SECRET` 环境变量 |

### 3.2 API 接口

#### 接口：按需重新验证

- **请求路径**：`/api/revalidate`
- **请求方式**：POST
- **请求头**：
  - `Content-Type`：application/json
- **请求参数**：
  - `secret`：string - 验证密钥，必须与环境变量 `REVALIDATION_SECRET` 一致
  - `paths`：string[] - 需要刷新的路径列表，如 `["/", "/articles", "/articles/my-post"]`
- **成功返回**（200）：
  ```json
  {
    "revalidated": true,
    "paths": ["/", "/articles", "/articles/my-post"]
  }
  ```
- **认证失败返回**（401）：
  ```json
  {
    "error": "无效的验证密钥"
  }
  ```
- **参数错误返回**（400）：
  ```json
  {
    "error": "paths 参数必填且为非空数组"
  }
  ```
- **用途**：后台管理系统在内容变更后调用，主动刷新 ISR 缓存

### 3.3 实现要点

1. **使用 `revalidatePath` API**
   - 从 `next/cache` 导入 `revalidatePath`
   - 对每个传入的路径调用 `revalidatePath(path)`
   - `revalidatePath` 会清除该路径的 ISR 缓存，下次访问时重新生成

2. **密钥验证**
   - 从环境变量 `REVALIDATION_SECRET` 读取密钥
   - 请求体中的 `secret` 必须与环境变量一致
   - 密钥不匹配返回 401 Unauthorized
   - 环境变量未配置时，API 返回 500 提示配置缺失

3. **路径校验**
   - `paths` 必须为非空字符串数组
   - 每个路径必须以 `/` 开头
   - 路径数量限制最多 20 个，防止滥用
   - 过滤无效路径后执行刷新

4. **错误处理**
   - 单个路径刷新失败不影响其他路径
   - 返回结果中包含每个路径的刷新状态
   - 捕获异常返回 500

5. **API 模式**
   - 参考现有 `app/api/comments/route.ts` 的代码风格
   - 使用 `NextRequest` / `NextResponse`
   - 不需要数据库操作，无需 `initAllModels`

### 3.4 代码示例

```typescript
// app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, paths } = body;

    // 验证密钥
    const expectedSecret = process.env.REVALIDATION_SECRET;
    if (!expectedSecret) {
      return NextResponse.json(
        { error: '服务端未配置 REVALIDATION_SECRET' },
        { status: 500 },
      );
    }

    if (secret !== expectedSecret) {
      return NextResponse.json(
        { error: '无效的验证密钥' },
        { status: 401 },
      );
    }

    // 校验 paths 参数
    if (!Array.isArray(paths) || paths.length === 0) {
      return NextResponse.json(
        { error: 'paths 参数必填且为非空数组' },
        { status: 400 },
      );
    }

    if (paths.length > 20) {
      return NextResponse.json(
        { error: '单次最多刷新 20 个路径' },
        { status: 400 },
      );
    }

    // 过滤有效路径并执行刷新
    const validPaths = paths.filter(
      (p: unknown) => typeof p === 'string' && p.startsWith('/'),
    );

    for (const path of validPaths) {
      revalidatePath(path);
    }

    return NextResponse.json({
      revalidated: true,
      paths: validPaths,
    });
  } catch (error) {
    console.error('Revalidation 失败:', error);
    return NextResponse.json(
      { error: 'Revalidation 失败' },
      { status: 500 },
    );
  }
}
```

### 3.5 环境变量配置

在 `.env` 文件中添加：

```
REVALIDATION_SECRET=your-secret-token-here
```

生产环境中应使用强随机字符串，例如通过 `openssl rand -hex 32` 生成。

### 3.6 数据流转

```
后台管理系统操作流程:

发布新文章:
  后台 CMS → 保存文章到数据库
  → POST /api/revalidate { secret, paths: ["/", "/articles"] }
  → revalidatePath("/") + revalidatePath("/articles")
  → 下次用户访问首页/列表页时重新生成

更新文章:
  后台 CMS → 更新文章数据库记录
  → POST /api/revalidate { secret, paths: ["/", "/articles", "/articles/my-post"] }
  → revalidatePath 清除三个页面缓存
  → 下次用户访问时重新生成

删除文章:
  后台 CMS → 软删除文章
  → POST /api/revalidate { secret, paths: ["/", "/articles"] }
  → 首页和列表页缓存清除
```

---

## 四、验收标准

- [ ] POST `/api/revalidate` 正确验证密钥
- [ ] 密钥错误时返回 401
- [ ] 密钥正确时成功刷新指定路径的 ISR 缓存
- [ ] `paths` 参数为空或非数组时返回 400
- [ ] 路径数量超过 20 时返回 400
- [ ] 无效路径（不以 `/` 开头）被过滤
- [ ] 环境变量 `REVALIDATION_SECRET` 未配置时返回 500
- [ ] TypeScript 编译通过（`tsc --noEmit`）

---

## 五、注意事项

### 5.1 边界情况

- 路径不存在（如 `/articles/non-existent`）：`revalidatePath` 不会报错，静默忽略
- 路径格式错误（不以 `/` 开头）：过滤掉，不执行刷新
- 空数组：返回 400 错误
- 重复路径：允许，`revalidatePath` 多次调用同一路径无副作用

### 5.2 异常处理

- 请求体 JSON 解析失败：返回 500
- `revalidatePath` 内部异常：捕获并返回 500
- 环境变量缺失：返回 500 并提示配置

### 5.3 安全考虑

- 密钥必须通过环境变量配置，不可硬编码
- 生产环境使用强随机密钥（至少 32 字符）
- 限制单次刷新路径数量（最多 20 个），防止滥用
- 仅接受 POST 请求，不暴露 GET 接口

### 5.4 与现有 ISR 配置的关系

当前项目中使用 ISR 的页面：

| 页面 | 文件 | revalidate 值 |
|-----|------|--------------|
| 首页 | `app/page.tsx` | 3600（1小时） |
| 文章列表页 | `app/articles/page.tsx` | 3600（1小时） |
| 文章详情页 | `app/articles/[slug]/page.tsx` | 3600（1小时） |

On-Demand Revalidation 与定时 revalidate 互补：
- **定时 revalidate**：每小时自动刷新，作为兜底机制
- **On-Demand Revalidation**：内容变更时立即刷新，确保实时性

---

## 六、关联信息

- **下一步骤**：无（本步骤为最后一步）
- **相关文档**：
  - 技术方案 2.2.4 服务端渲染策略（ISR + On-Demand Revalidation）
  - 技术方案 4.4 决策四：文章列表和详情页都使用 ISR
  - 技术方案 3.4 数据流设计 - 发布文章流程
  - Next.js 官方文档：[On-Demand Revalidation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration#on-demand-revalidation-with-revalidatepath)
