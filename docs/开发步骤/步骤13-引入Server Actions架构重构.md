# 步骤13：引入 Server Actions 架构重构

## 步骤信息

- **步骤序号**：13 / 13
- **关联 PRD 功能**：技术架构升级 - 混合模式（Server Actions + API Routes）
- **前置步骤**：步骤9（评论系统开发）
- **预计工作量**：中等

---

## 一、步骤目标

根据技术方案文档 v1.4 的混合架构设计，引入 Server Actions 并重构评论提交功能，实现 App Router + Server Actions 的混合架构。保留 API Routes 用于数据查询和外部调用，使用 Server Actions 处理表单提交和数据变更操作。

---

## 二、需求说明

### 2.1 架构升级目标

根据技术方案文档（`docs/技术文档/博客系统技术方案.md` 第 106-153 行），实现以下架构升级：

- **引入 Server Actions**：用于表单提交和数据变更操作
  - 评论发表、点赞、用户操作
  - 优势：类型安全、减少样板代码、自动处理加载状态、CSRF 保护

- **保留 API Routes**：用于数据查询和外部调用
  - 评论列表查询（GET）、搜索、统计数据、Webhook
  - 优势：RESTful 标准、可被外部服务调用、易于测试

### 2.2 迁移范围

**本步骤迁移内容**：
- ✅ 评论提交（POST /api/comments）→ Server Action `submitComment`
- ✅ 创建 `app/actions/` 目录结构
- ✅ 更新评论表单组件使用 Server Actions

**保留 API Routes**：
- ✅ 评论列表查询（GET /api/comments）- 数据查询
- ✅ 搜索功能（GET /api/search）- 复杂查询
- ✅ 统计数据（GET /api/stats）- 数据查询
- ✅ ISR 触发（POST /api/revalidate）- 外部调用
- ✅ 验证码生成（GET /api/captcha）- 返回图片

### 2.3 技术要求

根据技术方案文档（第 298-378 行）的 Server Actions 使用规范：

1. **文件组织**：所有 Server Actions 放在 `app/actions/` 目录
2. **命名规范**：使用动词开头，如 `submitComment`、`likeArticle`
3. **类型安全**：使用 TypeScript 定义参数和返回值类型
4. **错误处理**：使用 try-catch 捕获错误，返回错误信息
5. **缓存管理**：使用 `revalidatePath()` 或 `revalidateTag()` 刷新缓存
6. **安全性**：Server Actions 自动提供 CSRF 保护，但仍需验证用户权限

---

## 三、技术实现指引

### 3.1 涉及文件

| 文件路径 | 操作类型 | 说明 |
|---------|---------|------|
| `app/actions/comments.ts` | 新增 | Server Actions - 评论提交 |
| `app/actions/index.ts` | 新增 | Server Actions 导出文件 |
| `app/articles/[slug]/components/CommentForm.tsx` | 修改 | 更新为使用 Server Actions |
| `app/api/comments/route.ts` | 修改 | 移除 POST 方法，保留 GET 方法 |
| `app/articles/[slug]/types/article-detail.types.ts` | 修改 | 添加 Server Action 返回类型 |

### 3.2 Server Actions 实现

#### 文件1：`app/actions/comments.ts`

根据技术方案文档（第 303-322 行）的基本语法，创建评论提交 Server Action：

```typescript
'use server'

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { createComment } from '@/app/services/comment';
import { verifyCaptcha } from '@/app/utils/captcha';
import { apiLogger, defaultLogger } from '@/app/utils/logger';

/**
 * Server Action 返回类型
 */
export interface SubmitCommentResult {
  success: boolean;
  message?: string;
  error?: string;
  comment?: {
    id: number;
    authorName: string;
    content: string;
    createdAt: number;
    status: string;
  };
}

/**
 * 提交评论 Server Action
 *
 * @param prevState - 前一个状态（useFormState 需要）
 * @param formData - 表单数据
 * @returns 操作结果
 */
export async function submitComment(
  prevState: SubmitCommentResult | null,
  formData: FormData
): Promise<SubmitCommentResult> {
  try {
    // 提取表单数据
    const articleId = Number(formData.get('articleId'));
    const authorName = String(formData.get('authorName') || '').trim().slice(0, 100);
    const authorEmail = formData.get('authorEmail')
      ? String(formData.get('authorEmail')).trim().slice(0, 255)
      : null;
    const content = String(formData.get('content') || '').trim().slice(0, 2000);
    const parentId = formData.get('parentId') ? Number(formData.get('parentId')) : null;
    const captchaToken = String(formData.get('captchaToken') || '');
    const captchaAnswer = String(formData.get('captchaAnswer') || '');

    apiLogger.info(`[submitComment] articleId=${articleId}, authorName=${authorName}`);

    // 验证必填字段
    if (!articleId || !authorName || !content) {
      return {
        success: false,
        error: 'articleId、authorName、content 为必填项',
      };
    }

    // 验证码校验
    const captchaResult = verifyCaptcha(captchaToken, captchaAnswer);
    if (!captchaResult.valid) {
      return {
        success: false,
        error: captchaResult.error || '验证码错误',
      };
    }

    // 获取客户端 IP
    const headersList = await headers();
    const ip =
      headersList.get('x-forwarded-for')?.split(',')[0]?.trim()
      || headersList.get('x-real-ip')
      || null;

    // 调用服务层创建评论
    const comment = await createComment({
      articleId,
      parentId,
      authorName,
      authorEmail,
      content,
      authorIp: ip,
    });

    // 自动刷新文章详情页缓存
    revalidatePath(`/articles/${articleId}`);

    return {
      success: true,
      message: '评论已提交，等待审核',
      comment,
    };
  } catch (error) {
    defaultLogger.error('提交评论失败:', error);
    return {
      success: false,
      error: '提交评论失败，请稍后重试',
    };
  }
}
```

#### 文件2：`app/actions/index.ts`

```typescript
/**
 * Server Actions 导出文件
 */

export { submitComment } from './comments';
export type { SubmitCommentResult } from './comments';
```

### 3.3 更新评论表单组件

#### 文件3：修改 `app/articles/[slug]/components/CommentForm.tsx`

根据技术方案文档（第 324-352 行）的客户端使用示例，更新评论表单：

```typescript
'use client'

import { useFormState, useFormStatus } from 'react-dom';
import { submitComment } from '@/app/actions/comments';
import type { SubmitCommentResult } from '@/app/actions/comments';
import { useState, useEffect } from 'react';

interface CommentFormProps {
  articleId: number;
  parentId?: number | null;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function CommentForm({
  articleId,
  parentId = null,
  onSuccess,
  onCancel,
}: CommentFormProps) {
  const [state, formAction] = useFormState<SubmitCommentResult | null, FormData>(
    submitComment,
    null
  );
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaImageUrl, setCaptchaImageUrl] = useState('');

  // 加载验证码
  useEffect(() => {
    loadCaptcha();
  }, []);

  // 处理提交成功
  useEffect(() => {
    if (state?.success) {
      // 显示成功提示
      alert(state.message || '评论已提交');
      // 重新加载验证码
      loadCaptcha();
      // 调用成功回调
      onSuccess?.();
    }
  }, [state, onSuccess]);

  const loadCaptcha = async () => {
    try {
      const response = await fetch('/api/captcha');
      const data = await response.json();
      setCaptchaToken(data.token);
      setCaptchaImageUrl(data.imageUrl);
    } catch (error) {
      console.error('加载验证码失败:', error);
    }
  };

  return (
    <form action={formAction} className="space-y-4">
      {/* 隐藏字段 */}
      <input type="hidden" name="articleId" value={articleId} />
      {parentId && <input type="hidden" name="parentId" value={parentId} />}
      <input type="hidden" name="captchaToken" value={captchaToken} />

      {/* 昵称输入框 */}
      <div>
        <label htmlFor="authorName" className="block text-sm font-medium mb-2">
          昵称 *
        </label>
        <input
          type="text"
          id="authorName"
          name="authorName"
          required
          maxLength={100}
          className="w-full px-4 py-2 rounded-lg border border-primary/50
                     bg-background-light dark:bg-background-dark
                     focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="请输入昵称"
        />
      </div>

      {/* 邮箱输入框（可选） */}
      <div>
        <label htmlFor="authorEmail" className="block text-sm font-medium mb-2">
          邮箱（可选）
        </label>
        <input
          type="email"
          id="authorEmail"
          name="authorEmail"
          maxLength={255}
          className="w-full px-4 py-2 rounded-lg border border-primary/50
                     bg-background-light dark:bg-background-dark
                     focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="用于接收回复通知"
        />
      </div>

      {/* 评论内容 */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-2">
          评论内容 *
        </label>
        <textarea
          id="content"
          name="content"
          required
          maxLength={2000}
          rows={4}
          className="w-full px-4 py-2 rounded-lg border border-primary/50
                     bg-background-light dark:bg-background-dark
                     focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary
                     resize-none"
          placeholder="说说你的想法..."
        />
      </div>

      {/* 验证码 */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label htmlFor="captchaAnswer" className="block text-sm font-medium mb-2">
            验证码 *
          </label>
          <input
            type="text"
            id="captchaAnswer"
            name="captchaAnswer"
            required
            maxLength={4}
            className="w-full px-4 py-2 rounded-lg border border-primary/50
                       bg-background-light dark:bg-background-dark
                       focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="请输入验证码"
          />
        </div>
        {captchaImageUrl && (
          <div className="flex flex-col items-center gap-2">
            <img
              src={captchaImageUrl}
              alt="验证码"
              className="h-10 rounded cursor-pointer"
              onClick={loadCaptcha}
            />
            <button
              type="button"
              onClick={loadCaptcha}
              className="text-xs text-primary hover:underline"
            >
              换一张
            </button>
          </div>
        )}
      </div>

      {/* 错误提示 */}
      {state?.error && (
        <div className="p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
          {state.error}
        </div>
      )}

      {/* 提交按钮 */}
      <div className="flex gap-3">
        <SubmitButton />
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 rounded-full border border-primary/50
                       hover:bg-primary/10 transition-colors"
          >
            取消
          </button>
        )}
      </div>
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-8 py-3 bg-cta-light dark:bg-cta-dark text-white
                 rounded-full font-bold tracking-wide
                 hover:shadow-lg transition-shadow
                 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {pending ? '提交中...' : '发表评论'}
    </button>
  );
}
```

### 3.4 更新 API Routes

#### 文件4：修改 `app/api/comments/route.ts`

移除 POST 方法，保留 GET 方法用于查询评论列表：

```typescript
/**
 * 评论 API
 * GET  /api/comments?articleId=N  — 获取已审核评论列表
 *
 * 注意：评论提交功能已迁移到 Server Actions（app/actions/comments.ts）
 */

import { NextRequest, NextResponse } from 'next/server';

import { getCommentsByArticleId } from '@/services';
import { apiLogger, defaultLogger } from '@/utils/logger';

export async function GET(request: NextRequest) {
  try {
    const articleId = parseInt(
      request.nextUrl.searchParams.get('articleId') || '',
      10,
    );

    apiLogger.info(`[GET /api/comments] articleId=${articleId}`);

    if (!articleId || isNaN(articleId)) {
      return NextResponse.json(
        { error: 'articleId 参数必填' },
        { status: 400 },
      );
    }

    const result = await getCommentsByArticleId(articleId);

    return NextResponse.json(
      result,
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    defaultLogger.error('获取评论失败:', error);
    return NextResponse.json(
      { error: '获取评论失败' },
      { status: 500 },
    );
  }
}
```

### 3.5 更新类型定义

#### 文件5：修改 `app/articles/[slug]/types/article-detail.types.ts`

添加 Server Action 相关类型：

```typescript
// ... 现有类型定义 ...

/**
 * Server Action 返回类型（从 actions 导出）
 */
export type { SubmitCommentResult } from '@/app/actions/comments';
```

### 3.6 数据流转

```
评论提交流程（Server Actions）:
  CommentForm（客户端组件）
    ↓ useFormState + formAction
  submitComment（Server Action）
    ↓ 验证 + 调用服务层
  createComment（服务层）
    ↓ Sequelize 创建记录
  数据库（comments 表）
    ↓ 返回结果
  revalidatePath（刷新缓存）
    ↓ 返回成功/失败
  CommentForm（显示结果）

评论列表查询流程（API Routes）:
  CommentSection（客户端组件）
    ↓ useEffect + fetch
  GET /api/comments?articleId=N
    ↓ 调用服务层
  getCommentsByArticleId（服务层）
    ↓ Sequelize 查询
  数据库（comments 表）
    ↓ 返回列表
  CommentSection（渲染列表）
```

---

## 四、验收标准

### 4.1 功能验收

- [ ] `app/actions/` 目录已创建
- [ ] `app/actions/comments.ts` 文件已创建，包含 `submitComment` Server Action
- [ ] `app/actions/index.ts` 导出文件已创建
- [ ] CommentForm 组件已更新为使用 Server Actions
- [ ] 评论提交功能正常（使用 Server Actions）
- [ ] 提交中状态正确显示（"提交中..."）
- [ ] 提交成功后显示成功提示
- [ ] 提交失败后显示错误提示
- [ ] 验证码校验正常工作
- [ ] 评论列表查询功能正常（使用 API Routes）
- [ ] `app/api/comments/route.ts` 已移除 POST 方法，保留 GET 方法

### 4.2 技术验收

- [ ] Server Actions 使用 `'use server'` 指令
- [ ] 使用 `useFormState` 和 `useFormStatus` Hooks
- [ ] 使用 `revalidatePath` 自动刷新缓存
- [ ] 错误处理完整（try-catch + 返回错误信息）
- [ ] 类型定义完整（TypeScript）
- [ ] 日志记录正常（apiLogger）
- [ ] CSRF 保护自动生效（Server Actions 内置）
- [ ] IP 地址正确获取（使用 `headers()` API）

### 4.3 代码质量

- [ ] TypeScript 编译通过（`tsc --noEmit`）
- [ ] ESLint 通过（`npm run lint`）
- [ ] 代码符合 CLAUDE.md 规范
- [ ] 注释清晰完整
- [ ] 无硬编码或魔法数字

---

## 五、注意事项

### 5.1 Server Actions 使用规范

根据技术方案文档（第 354-366 行）：

1. **文件组织**：所有 Server Actions 放在 `app/actions/` 目录
2. **命名规范**：使用动词开头（submitComment、likeArticle）
3. **类型安全**：定义完整的参数和返回值类型
4. **错误处理**：使用 try-catch，返回友好的错误信息
5. **缓存管理**：使用 `revalidatePath()` 刷新相关页面缓存
6. **保持简洁**：Server Actions 只处理数据变更，复杂逻辑放在服务层

### 5.2 混合架构原则

根据技术方案文档（第 131-135 行）：

- **Server Actions 优先**：新功能的表单提交和数据变更操作优先使用 Server Actions
- **API Routes 保留**：保留用于外部调用、复杂查询、特殊响应需求的场景
- **向后兼容**：现有 API Routes 继续工作，不强制迁移
- **渐进式迁移**：逐步将适合的功能迁移到 Server Actions

### 5.3 边界情况

- **验证码失效**：Server Action 返回错误，前端重新加载验证码
- **网络超时**：useFormState 自动处理 pending 状态
- **并发提交**：useFormStatus 的 pending 状态自动禁用提交按钮
- **缓存刷新**：revalidatePath 自动刷新文章详情页，评论列表通过 CSR 重新加载

### 5.4 性能优化

- **减少网络开销**：Server Actions 使用优化的 RPC 调用，比完整 HTTP 请求更轻量
- **自动类型推断**：Server Actions 的参数和返回值类型自动推断，减少类型定义
- **缓存自动管理**：revalidatePath 自动刷新 ISR 缓存，无需手动处理

---

## 六、关联信息

- **前置步骤**：步骤9 - 评论系统开发
- **相关文档**：
  - 技术方案：`docs/技术文档/博客系统技术方案.md`（第 106-378 行）
  - PRD：`docs/prd/PRD.md`
  - 数据库设计：`docs/表设计/博客数据库设计.md`（comments 表）

---

## 七、后续扩展

完成本步骤后，可以继续迁移其他适合 Server Actions 的功能：

- **点赞功能**：文章点赞、评论点赞
- **用户操作**：订阅、收藏、举报
- **表单提交**：联系表单、反馈表单

所有数据查询和外部调用继续使用 API Routes。
