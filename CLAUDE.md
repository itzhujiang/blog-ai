# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个 Next.js 16 博客AI项目，使用以下技术栈：
- Next.js 16.0.1 with App Router
- React 19.2.0 with TypeScript
- Tailwind CSS v4 for styling
- ESLint with Next.js configuration

## 开发命令

### 核心开发命令
```bash
npm run dev          # 启动开发服务器 (http://localhost:3000)
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 运行 ESLint 检查
```

### 包管理
- 使用 npm 作为包管理器 (存在 package-lock.json)
- 通过 package.json 管理 Node.js 依赖

## 架构与项目结构

### App Router 结构
- **app/**: Next.js App Router 目录
  - `layout.tsx`: 根布局文件，配置了 Geist 字体
  - `page.tsx`: 首页组件（目前非常简洁）
  - `globals.css`: 全局样式文件，使用 Tailwind CSS v4 和 CSS 变量进行主题配置

### 配置文件
- **next.config.ts**: Next.js 配置（目前为最小配置）
- **tsconfig.json**: TypeScript 配置，启用严格模式和路径别名（`@/*` 映射到根目录）
- **eslint.config.mjs**: ESLint 配置，使用 Next.js 预设和自定义全局忽略规则
- **postcss.config.mjs**: Tailwind CSS 的 PostCSS 配置

### 样式系统
- 使用 Tailwind CSS v4，采用内联主题配置
- CSS 变量支持主题颜色（亮色/暗色模式）
- Geist Sans 和 Geist Mono 字体配置为 CSS 变量
- 响应式设计，支持暗色模式偏好检测

### TypeScript 配置
- 启用严格模式
- 路径别名：`@/*` 映射到项目根目录
- Next.js 插件集成，提供最佳开发体验
- 同时支持 CommonJS 和 ES 模块

## 开发注意事项

### 字体配置
项目使用 Geist 字体系列，配置为 CSS 变量：
- `--font-geist-sans`: 无衬线字体
- `--font-geist-mono`: 等宽字体

### CSS 主题系统
- 亮色模式：`--background: #ffffff`, `--foreground: #171717`
- 暗色模式：`--background: #0a0a0a`, `--foreground: #ededed`
- 基于 `prefers-color-scheme` 自动主题切换

### 路径别名
使用 `@/` 前缀从项目根目录导入（在 tsconfig.json 中配置）

### 当前状态
- 最小化的起始实现，具备基本的 Next.js 设置
- 首页组件基本为空（仅包含一个 div 包装器）
- 已准备好进行博客AI功能的开发

## 代码格式规范

所有代码必须遵循以下格式规范，确保代码质量和一致性：

### 命名规范
- **变量/函数/方法**：使用小驼峰命名法（camelCase），如 `userName`、`getUserData()`。函数名建议以动词开头，如 `handle`、`show`、`fetch`、`on`等
- **类名/构造函数**：使用大驼峰命名法（PascalCase），如 `UserProfile`、`HomePage`
- **常量**：使用大写字母和下划线的组合，如 `MAX_COUNT`、`API_BASE_URL`
- **文件与目录**：使用小写字母，以连字符分隔（kebab-case），例如 `my-project`、`user-profile.js`。如果目录有复数含义，建议使用复数形式，如 `scripts`、`images`

### 代码格式化
- **缩进**：统一使用 2个空格作为一个缩进层级
- **空格与换行**：在运算符（如 `=`, `+`, `>`）前后、逗号后、花括号 `{` 前添加空格。在不同的逻辑代码块之间适当使用空行分隔
- **分号**：显式地添加分号以避免潜在的解析错误
- **引号**：在 HTML 和 CSS 中属性值统一使用双引号。JavaScript 中统一使用单引号或反引号（模板字符串）

### 注释规范
- 注释的目的是解释"为什么"要这样写，而不是重复"是什么"
- **函数/方法注释**：对复杂函数应使用 JSDoc 等形式注释，说明功能、参数和返回值
- **复杂逻辑注释**：对于复杂的算法或业务逻辑，应添加注释说明其思路
- **TODO注释**：用于标记待完成的任务或需要优化的代码，如 `// TODO: 优化此函数性能`

## 技术栈特定规范

### HTML
- 优先使用 `<header>`, `<main>`, `<nav>` 等语义化标签
- 属性顺序：建议按 `class`, `id`, `name`, `data-*`, `src/href/type`, `placeholder/title/alt`, `aria-*/role` 的顺序排列
- 为 `<img>` 标签添加有意义的 `alt` 属性

### CSS
- 类名语义化：使用短横线命名法（kebab-case），如 `.user-avatar`
- 属性声明顺序：推荐按布局（display, position） -> 盒模型（width, margin, padding） -> 文字（font, color） -> 视觉（background, border）的顺序书写
- 避免过深嵌套：在预处理器（如Sass/Less）中，选择器嵌套不宜超过3层

### Tailwind CSS 专业使用规范

#### 核心原则
Tailwind 是 utility-first 框架，但不意味着要在每个元素上堆砌大量类名。专业的使用方式是：**系统化思维 + 可维护性优先**。

#### 1. 停止编写"Utility 小说"

**❌ 不好的示例**（类名过多，难以维护）：
```tsx
<div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300 ease-in-out flex items-center justify-center gap-2 w-full max-w-sm mx-auto border border-blue-700" />
```

**✅ 专业做法**（使用 @apply 或组件抽象）：
```css
/* app/globals.css */
@layer components {
  .btn-primary {
    @apply bg-primary text-background-dark px-8 py-3 rounded-full
           font-bold tracking-wide hover:shadow-lg transition-shadow;
  }
}
```

```tsx
<button className="btn-primary">Click Me</button>
```

#### 2. 善用 Design Token

在 `tailwind.config.js` 中定义品牌色、间距、字体等设计系统，而不是零散地使用 utility class。

**✅ 配置 Design Token**：
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#D4A574',
        'background-light': '#F8F6F2',
        'background-dark': '#1e1914',
        'text-light': '#8B6F47',
        'text-dark': '#e0d5c6',
      },
      spacing: {
        '18': '4.5rem',
      },
      fontSize: {
        'article-title': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
      },
    },
  },
}
```

**✅ 使用 Design Token**：
```tsx
<div className="bg-primary text-background-dark" />
```

**好处**：当设计系统变更时，只需修改配置文件，而不是在 93 个组件中逐个查找替换。

#### 3. 创建可复用的组件

使用 React 组件封装样式，而不是到处复制粘贴类名。

**✅ 创建 Button 组件**：
```tsx
// components/ui/Button.tsx
import { cn } from '@/lib/utils';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className
}: ButtonProps) {
  return (
    <button
      className={cn(
        'rounded-full font-bold tracking-wide transition-shadow',
        {
          'bg-primary text-background-dark hover:shadow-lg': variant === 'primary',
          'bg-cta-light dark:bg-cta-dark text-white': variant === 'secondary',
          'border-2 border-primary bg-transparent': variant === 'outline',
        },
        {
          'px-4 py-2 text-sm': size === 'sm',
          'px-8 py-3 text-base': size === 'md',
          'px-12 py-4 text-lg': size === 'lg',
        },
        className
      )}
    >
      {children}
    </button>
  );
}
```

**✅ 使用组件**：
```tsx
<Button variant="primary" size="md">阅读我的故事</Button>
```

#### 4. 使用 cn 工具函数合并类名

安装依赖：
```bash
npm install clsx tailwind-merge
```

创建工具函数：
```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**好处**：
- `clsx`：条件类名处理
- `twMerge`：智能合并 Tailwind 类名，避免冲突

#### 5. 响应式设计要有规划

**❌ 不好的示例**（随意使用响应式类名）：
```tsx
<p className="text-sm md:text-lg lg:text-base hover:underline hover:opacity-70 focus:text-xl">
  Hello
</p>
```

**✅ 好的示例**（有规划的响应式）：
```tsx
<p className="text-sm md:text-lg hover:underline focus:opacity-70">
  Hello
</p>
```

**✅ 网格布局的响应式**：
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* 移动端1列，平板2列，桌面3列 */}
</div>
```

#### 6. 在 globals.css 中定义组件类

```css
/* app/globals.css */
@layer components {
  /* 按钮组件 */
  .btn-primary {
    @apply px-8 py-3 bg-primary text-background-dark
           rounded-full font-bold tracking-wide
           hover:shadow-lg transition-shadow;
  }

  /* 文章卡片 */
  .article-card {
    @apply border-2 border-primary/50 rounded p-4
           shadow-natural hover:-translate-y-1
           hover:shadow-natural-hover transition-all duration-300
           bg-background-light dark:bg-background-dark;
  }

  /* 输入框 */
  .input-primary {
    @apply h-10 rounded-full border-2 border-primary/50
           bg-background-light dark:bg-background-dark
           px-4 py-2 text-sm
           placeholder-text-light/60 dark:placeholder-text-dark/60
           focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary;
  }
}
```

#### 7. 配置 Tailwind，不要对抗它

如果发现自己在写大量自定义 CSS，可能是配置不够完善。

**需要自定义动画？**
```javascript
// tailwind.config.js
theme: {
  extend: {
    keyframes: {
      fadeIn: {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      }
    },
    animation: {
      fadeIn: 'fadeIn 0.3s ease-in-out',
    }
  }
}
```

**需要特定的 grid 布局？**
```javascript
theme: {
  extend: {
    gridTemplateColumns: {
      'article': '1fr 300px',
    }
  }
}
```

#### 最佳实践总结

1. **整理类名**：超过 5 个类名考虑使用 @apply 或组件
2. **善用配置**：在 config 中定义设计系统
3. **抽离模式**：重复的样式组合提取为组件类
4. **系统化思维**：用设计系统的思维写 Tailwind
5. **保持一致性**：同类元素使用相同的样式模式

**记住**：
- 初学者的 Tailwind = 快速但混乱
- 专业开发者的 Tailwind = 快速且可维护 🚀

### JavaScript/TypeScript
- **变量声明**：优先使用 `const`，需要重新赋值时使用 `let`，避免使用 `var`
- **类型判断**：使用 `===` 和 `!==` 进行严格比较
- **箭头函数**：在需要保持 `this` 上下文或需要更简洁的函数表达式时，优先使用箭头函数
- **模块化**：使用 ES6 Module（`import/export`）来组织代码

### React 组件
- 组件文件命名使用 PascalCase，如 `UserProfile.tsx`
- Props 接口使用 PascalCase 并以 `Props` 结尾，如 `UserProfileProps`
- 使用函数式组件和 Hooks
- 组件内部状态使用 `useState`，副作用使用 `useEffect`
- 条件渲染使用 JSX 三元运算符或逻辑运算符

## 组件颗粒度和文件长度规范

### 组件长度限制
- **单个组件/页面文件**：最多 200-300 行代码
- **复杂组件拆分**：超过 200 行时，考虑拆分为多个子组件
- **功能组件化**：每个组件应该有单一职责，功能明确
- **可维护性原则**：组件应该易于理解、测试和维护

### 组件拆分建议
- **UI 组件**：纯展示组件，控制在 100-150 行以内
- **容器组件**：包含状态管理的组件，控制在 200 行以内
- **页面组件**：路由页面组件，控制在 300 行以内
- **工具函数**：超过 50 行的工具函数应考虑进一步拆分

### 组件组织结构
```tsx
// 推荐的组件文件结构
interface UserProfileProps {
  // Props 接口定义 (20-30 行)
}

const UserProfile: React.FC<UserProfileProps> = ({
  // 组件参数解构 (5-10 行)
}) => {
  // Hooks 和状态管理 (20-40 行)

  // 事件处理函数 (30-50 行)

  // 计算属性和副作用 (20-30 行)

  // JSX 返回 (50-100 行)

  return (
    // 组件 JSX
  );
};

export default UserProfile;
```

### 何时拆分组件
- **超过 200 行**：开始考虑拆分为子组件
- **多个不相关功能**：将不同功能拆分为独立组件
- **复杂的条件渲染**：将渲染逻辑提取为组件
- **重复的 JSX 结构**：抽象为可复用组件
- **状态管理复杂**：将状态逻辑分离到自定义 Hook

### 文件命名和组织

#### 页面组件组织结构
```
app/
├── blog/                          # 页面文件夹
│   ├── page.tsx                   # 主页面组件 (200-300 行)
│   ├── components/                 # 页面专属组件文件夹
│   │   ├── BlogPostCard.tsx        # 博客文章卡片 (50-100 行)
│   │   ├── BlogSidebar.tsx         # 博客侧边栏 (100-150 行)
│   │   ├── SearchBar.tsx           # 搜索栏 (30-80 行)
│   │   └── index.ts               # 组件导出文件
│   ├── hooks/                      # 页面专属 Hooks
│   │   ├── useBlogPosts.ts         # 博客文章数据 Hook
│   │   ├── useSearch.ts            # 搜索功能 Hook
│   │   └── index.ts               # Hook 导出文件
│   ├── types/                      # 页面专属类型定义
│   │   ├── blog.types.ts           # 博客相关类型
│   │   └── index.ts               # 类型导出文件
│   └── utils/                      # 页面专属工具函数
│       ├── formatters.ts            # 格式化函数
│       ├── validators.ts            # 验证函数
│       └── index.ts               # 工具导出文件
└── components/                    # 全局通用组件文件夹
    ├── ui/                       # 通用 UI 组件
    │   ├── Button.tsx
    │   ├── Input.tsx
    │   ├── Modal.tsx
    │   └── index.ts
    ├── layout/                   # 布局组件
    │   ├── Header.tsx
    │   ├── Footer.tsx
    │   ├── Navigation.tsx
    │   └── index.ts
    └── business/                 # 通用业务组件
        ├── UserAvatar.tsx
        ├── ProductCard.tsx
        └── index.ts
```

#### 文件命名规范
- **组件文件**：使用 PascalCase，如 `UserProfile.tsx`
- **Hook 文件**：以 `use` 开头，如 `useUserData.ts`
- **工具文件**：使用 kebab-case，如 `user-utils.ts`
- **类型定义**：使用 kebab-case + `.types.ts`，如 `user.types.ts`
- **导出文件**：统一使用 `index.ts` 管理模块导出

#### 页面专属文件夹的优势
- **逻辑清晰**：页面相关的所有文件都在同一个目录下
- **命名空间隔离**：避免组件名冲突（如 `components/BlogPostCard.tsx` vs `components/Card.tsx`）
- **易于维护**：修改页面时只需关注对应文件夹
- **复用性控制**：明确区分通用组件和页面专属组件
- **团队协作**：不同开发者可以独立维护不同页面
- **符合 Next.js 约定**：不影响约定式路由，只识别特殊文件名如 `page.tsx`

#### 何时创建页面专属 components 文件夹
- **超过 200 行**的主页面组件
- **包含 3+ 个**不相关功能模块
- **需要多次拆分**组件的情况
- **复杂的表单页面**或数据展示页面
- **页面间组件命名可能冲突**的情况

#### 何时使用全局 components 文件夹
- **通用 UI 组件**：Button、Input、Modal、Card 等
- **跨页面复用**的组件
- **设计系统组件**：Theme、Layout、Navigation 等
- **基础业务组件**：UserAvatar、ProductCard 等

#### 导出文件示例
```tsx
// app/blog/components/index.ts
export { default as BlogPostCard } from './BlogPostCard';
export { default as BlogSidebar } from './BlogSidebar';
export { default as SearchBar } from './SearchBar';

// app/blog/hooks/index.ts
export { useBlogPosts } from './useBlogPosts';
export { useSearch } from './useSearch';

// app/blog/types/index.ts
export type { BlogPost, BlogCategory } from './blog.types';
```

#### 导入使用示例
```tsx
// ✅ 清晰的导入方式
import { BlogPostCard, BlogSidebar, SearchBar } from './components';
import { useBlogPosts, useSearch } from './hooks';
import { BlogPost } from './types';

// ❌ 避免的导入方式
import BlogPostCard from './components/BlogPostCard';
import BlogSidebar from './components/BlogSidebar';
import SearchBar from './components/SearchBar';
```

#### 类型定义集中管理
```tsx
// app/blog/types/blog.types.ts
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  author: Author;
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export interface Author {
  id: string;
  name: string;
  avatar?: string;
  bio?: string;
}
```

### 最佳实践示例
```tsx
// ✅ 好的实践 - 组件粒度合适
const Button: React.FC<ButtonProps> = ({ children, onClick, variant }) => {
  const baseClasses = 'px-4 py-2 rounded';
  const variantClasses = variant === 'primary'
    ? 'bg-blue-500 text-white'
    : 'bg-gray-200 text-gray-800';

  return (
    <button
      className={`${baseClasses} ${variantClasses}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// ❌ 避免的实践 - 组件过于复杂
const HugeComponent: React.FC = () => {
  // 300+ 行代码，包含多个不相关功能
  // 应该拆分为 Button、Input、Card 等子组件
};
```