# 步骤2：通用UI组件开发 - 开发结果

## 完成状态

**状态**：✅ 已完成
**完成日期**：2026-02-04

---

## 一、已创建文件清单

### 1.1 基础设施文件

| 文件路径 | 状态 | 说明 |
|---------|------|-----|
| `src/utils/utils.ts` | ✅ | cn 工具函数（clsx + tailwind-merge） |
| `src/app/globals.css` | ✅ | 修改，添加主题变量和 Tailwind v4 配置 |

### 1.2 UI 组件文件

| 文件路径 | 状态 | 说明 |
|---------|------|-----|
| `src/components/ui/Button.tsx` | ✅ | 按钮组件，支持 3 种变体和 3 种尺寸 |
| `src/components/ui/Card.tsx` | ✅ | 卡片组件，含 Header/Content/Footer 子组件 |
| `src/components/ui/Input.tsx` | ✅ | 输入框组件，支持图标插槽 |
| `src/components/ui/Badge.tsx` | ✅ | 标签组件，支持 2 种变体 |
| `src/components/ui/Avatar.tsx` | ✅ | 头像组件，支持 4 种尺寸和 fallback |
| `src/components/ui/index.ts` | ✅ | UI 组件统一导出 |

---

## 二、已安装依赖

### 2.1 生产依赖

```bash
npm install clsx tailwind-merge
```

| 依赖包 | 版本 | 用途 |
|-------|------|-----|
| `clsx` | 2.1.1 | 条件类名处理 |
| `tailwind-merge` | 3.4.0 | 智能合并 Tailwind 类名 |

---

## 三、验收标准完成情况

| 验收项 | 状态 | 说明 |
|-------|------|-----|
| clsx 和 tailwind-merge 依赖安装完成 | ✅ | `npm ls` 验证通过 |
| src/utils/utils.ts 中的 cn 函数可正常使用 | ✅ | 导出 cn 函数 |
| Tailwind CSS v4 主题配置完成 | ✅ | 在 globals.css 中使用 @theme inline |
| globals.css 中定义了主题变量 | ✅ | 颜色、阴影、字体变量 |
| Button 组件支持 3 种变体和 3 种尺寸 | ✅ | primary/secondary/outline, sm/md/lg |
| Card 组件支持悬停效果 | ✅ | hoverable prop 控制 |
| Input 组件支持图标插槽 | ✅ | icon prop |
| Badge 组件支持 2 种变体 | ✅ | default/outline |
| Avatar 组件支持 4 种尺寸和 fallback | ✅ | sm/md/lg/xl, fallback prop |
| 所有组件支持亮色/暗色模式 | ✅ | 使用 dark: 前缀 |
| 组件导出文件正确导出所有组件和类型 | ✅ | index.ts 统一导出 |
| TypeScript 类型定义完整 | ✅ | 每个组件都有 Props 接口 |
| ESLint 检查通过 | ✅ | `npm run lint` 无错误 |

---

## 四、主题配置

### 4.1 颜色系统

```css
--primary: #D4A574
--background-light: #F8F6F2
--background-dark: #1e1914
--text-light: #8B6F47
--text-dark: #e0d5c6
--cta-light: #7A8B6E
--cta-dark: #a0b599
```

### 4.2 阴影系统

```css
--shadow-natural: 0 4px 10px rgba(139, 111, 71, 0.1)
--shadow-natural-hover: 0 8px 20px rgba(139, 111, 71, 0.15)
```

---

## 五、组件 API 说明

### 5.1 Button 组件

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}
```

### 5.2 Card 组件

```typescript
interface CardProps {
  children: ReactNode;
  hoverable?: boolean;
}
// 子组件: CardHeader, CardContent, CardFooter
```

### 5.3 Input 组件

```typescript
interface InputProps {
  icon?: ReactNode;
  // 继承所有原生 input 属性
}
```

### 5.4 Badge 组件

```typescript
interface BadgeProps {
  variant?: 'default' | 'outline';
  children: ReactNode;
}
```

### 5.5 Avatar 组件

```typescript
interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}
```

---

## 六、验证结果

### 6.1 依赖安装验证

```bash
npm ls clsx tailwind-merge
```

**结果**：✅ 通过
```
blog-ai@0.1.0
├── clsx@2.1.1
└── tailwind-merge@3.4.0
```

### 6.2 TypeScript 编译检查

```bash
npx tsc --noEmit
```

**结果**：✅ 通过，无错误

### 6.3 ESLint 检查

```bash
npm run lint
```

**结果**：✅ 通过，无错误

---

## 七、开发过程中的问题与解决

### 7.1 ESLint import/order 错误

**问题**：ESLint 报告 import 语句顺序错误，要求外部依赖和本地导入之间有空行

**解决**：在所有组件文件中，在外部依赖导入和本地模块导入之间添加空行

```typescript
// 修改前
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// 修改后
import { forwardRef } from 'react';

import { cn } from '@/lib/utils';
```

### 7.2 next/image 导入顺序错误

**问题**：ESLint 要求 `next/image` 导入在 `react` 之前

**解决**：调整 Avatar.tsx 中的导入顺序

```typescript
// 修改后
import Image from 'next/image';
import { forwardRef, type HTMLAttributes, useState } from 'react';

import { cn } from '@/lib/utils';
```

### 7.3 Tailwind CSS v4 配置方式

**问题**：Tailwind CSS v4 不再使用 tailwind.config.js/ts 文件

**解决**：使用 CSS 文件中的 `@theme inline` 指令配置主题

---

## 八、文件结构

```
src/utils/
└── utils.ts                     # cn 工具函数

src/components/
└── ui/
    ├── index.ts                 # 统一导出
    ├── Button.tsx               # 按钮组件
    ├── Card.tsx                 # 卡片组件
    ├── Input.tsx                # 输入框组件
    ├── Badge.tsx                # 标签组件
    └── Avatar.tsx               # 头像组件

src/app/
└── globals.css                  # 主题配置（已修改）
```

---

## 九、使用示例

```tsx
import {
  Button,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Input,
  Badge,
  Avatar
} from '@/components/ui';

// Button 示例
<Button variant="primary" size="md">点击按钮</Button>
<Button variant="secondary" size="lg">次要按钮</Button>
<Button variant="outline" size="sm">轮廓按钮</Button>

// Card 示例
<Card hoverable>
  <CardHeader>卡片标题</CardHeader>
  <CardContent>卡片内容</CardContent>
  <CardFooter>卡片底部</CardFooter>
</Card>

// Input 示例
<Input placeholder="请输入..." />
<Input icon={<SearchIcon />} placeholder="搜索..." />

// Badge 示例
<Badge>默认标签</Badge>
<Badge variant="outline">轮廓标签</Badge>

// Avatar 示例
<Avatar src="/avatar.jpg" alt="用户名" size="lg" />
<Avatar fallback="U" size="md" />
```

---

## 十、后续步骤

- **下一步骤**：步骤3 - 布局组件开发
- **使用说明**：
  1. 从 `@/components/ui` 导入所需组件
  2. 使用 `cn()` 函数合并自定义类名
  3. 所有组件支持 `className` prop 进行样式扩展
