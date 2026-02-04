# 步骤2：通用 UI 组件开发

## 步骤信息

- **步骤序号**：2 / 12
- **关联 PRD 功能**：全部页面的基础 UI 组件
- **前置步骤**：步骤1（数据库连接和模型定义）
- **预计工作量**：中等

---

## 一、步骤目标

开发博客系统的通用 UI 组件库，包括 Button、Card、Input、Badge 等基础组件，为后续页面开发提供统一的 UI 基础设施。同时配置 Tailwind CSS 主题和工具函数。

---

## 二、需求说明

### 2.1 功能要求

根据 PRD 和 UI 设计图，需要开发以下通用组件：

- **Button 组件**：支持 primary、secondary、outline 等变体，支持不同尺寸
- **Card 组件**：文章卡片的基础容器，支持悬停效果
- **Input 组件**：搜索框、评论输入框等表单元素
- **Badge 组件**：分类标签、状态标签
- **Avatar 组件**：博主头像展示

### 2.2 UI 设计要求

根据 UI 设计图（首页.html），提取设计规范：

**颜色系统**：
- 主色调：`#D4A574`（温暖原木色）
- 背景色（亮色）：`#F8F6F2`
- 背景色（暗色）：`#1e1914`
- 文字色（亮色）：`#8B6F47`
- 文字色（暗色）：`#e0d5c6`
- CTA 色（亮色）：`#7A8B6E`
- CTA 色（暗色）：`#a0b599`

**圆角规范**：
- 默认：`8px`
- 大：`12px`
- 超大：`16px`
- 全圆：`9999px`（按钮、标签）

**阴影规范**：
- 自然阴影：`0 4px 10px rgba(139, 111, 71, 0.1)`
- 悬停阴影：`0 8px 20px rgba(139, 111, 71, 0.15)`

**字体**：
- 主字体：Nunito, Noto Sans SC, sans-serif

### 2.3 业务规则

- 所有组件必须支持亮色/暗色模式
- 组件样式必须与 UI 设计图保持一致
- 使用 Tailwind CSS v4 的 @layer components 定义组件类
- 遵循 CLAUDE.md 中的 Tailwind CSS 专业使用规范

---

## 三、技术实现指引

### 3.1 涉及文件

| 文件路径 | 操作类型 | 说明 |
|---------|---------|-----|
| `src/utils/utils.ts` | 新增 | cn 工具函数（clsx + tailwind-merge） |
| `src/app/globals.css` | 修改 | 添加主题配置和组件类 |
| `src/components/ui/Button.tsx` | 新增 | 按钮组件 |
| `src/components/ui/Card.tsx` | 新增 | 卡片组件 |
| `src/components/ui/Input.tsx` | 新增 | 输入框组件 |
| `src/components/ui/Badge.tsx` | 新增 | 标签组件 |
| `src/components/ui/Avatar.tsx` | 新增 | 头像组件 |
| `src/components/ui/index.ts` | 新增 | UI 组件统一导出 |
| `tailwind.config.ts` | 新增 | Tailwind 主题配置 |
| `package.json` | 修改 | 添加 clsx 和 tailwind-merge 依赖 |

### 3.2 依赖包安装

```bash
npm install clsx tailwind-merge
```

### 3.3 实现要点

#### 1. cn 工具函数

创建类名合并工具函数，用于条件类名和 Tailwind 类名冲突处理：

```typescript
// src/utils/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

#### 2. Tailwind 主题配置

根据 UI 设计图配置主题：

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#D4A574',
        'background-light': '#F8F6F2',
        'background-dark': '#1e1914',
        'text-light': '#8B6F47',
        'text-dark': '#e0d5c6',
        'cta-light': '#7A8B6E',
        'cta-dark': '#a0b599',
      },
      fontFamily: {
        display: ['Nunito', 'Noto Sans SC', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        lg: '12px',
        xl: '16px',
      },
      boxShadow: {
        natural: '0 4px 10px rgba(139, 111, 71, 0.1)',
        'natural-hover': '0 8px 20px rgba(139, 111, 71, 0.15)',
      },
    },
  },
  plugins: [],
};

export default config;
```

#### 3. globals.css 组件类定义

在 globals.css 中使用 @layer components 定义可复用的组件类：

```css
/* src/app/globals.css */
@import 'tailwindcss';

/* 主题变量 */
:root {
  --background: #F8F6F2;
  --foreground: #8B6F47;
}

@media (prefers-color-scheme: dark) {
  :root {
    --background: #1e1914;
    --foreground: #e0d5c6;
  }
}

/* 组件类定义 */
@layer components {
  /* 主按钮 */
  .btn-primary {
    @apply px-8 py-3 bg-primary text-background-dark
           rounded-full font-bold tracking-wide
           hover:shadow-lg transition-shadow;
  }

  /* 次要按钮 */
  .btn-secondary {
    @apply px-8 py-3 bg-cta-light dark:bg-cta-dark text-white
           rounded-full font-bold tracking-wide
           hover:shadow-lg transition-shadow;
  }

  /* 轮廓按钮 */
  .btn-outline {
    @apply px-5 py-2 border-2 border-primary/50
           bg-background-light dark:bg-background-dark
           text-text-light dark:text-text-dark
           rounded-full font-semibold
           shadow-natural transition-all
           hover:bg-primary/20 dark:hover:bg-primary/30
           hover:shadow-natural-hover;
  }

  /* 文章卡片 */
  .article-card {
    @apply flex flex-col gap-4 overflow-hidden rounded
           border-2 border-primary/50
           bg-background-light dark:bg-background-dark
           p-4 shadow-natural transition-all duration-300
           hover:-translate-y-1 hover:shadow-natural-hover;
  }

  /* 输入框 */
  .input-primary {
    @apply h-10 rounded-full border-2 border-primary/50
           bg-background-light dark:bg-background-dark
           px-4 py-2 text-sm
           placeholder-text-light/60 dark:placeholder-text-dark/60
           focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary;
  }

  /* 标签 */
  .badge {
    @apply px-3 py-1 rounded-full text-xs font-medium
           bg-primary/20 text-text-light dark:text-text-dark;
  }
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: 'Nunito', 'Noto Sans SC', sans-serif;
}
```

#### 4. Button 组件实现

```tsx
// src/components/ui/Button.tsx
import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'cursor-pointer rounded-full font-bold tracking-wide transition-all',
          {
            'bg-primary text-background-dark hover:shadow-lg': variant === 'primary',
            'bg-cta-light dark:bg-cta-dark text-white hover:shadow-lg': variant === 'secondary',
            'border-2 border-primary/50 bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark hover:bg-primary/20 dark:hover:bg-primary/30 shadow-natural hover:shadow-natural-hover': variant === 'outline',
          },
          {
            'px-4 py-2 text-sm': size === 'sm',
            'px-8 py-3 text-base': size === 'md',
            'px-12 py-4 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
```

#### 5. Card 组件实现

```tsx
// src/components/ui/Card.tsx
import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col gap-4 overflow-hidden rounded',
          'border-2 border-primary/50',
          'bg-background-light dark:bg-background-dark',
          'p-4 shadow-natural transition-all duration-300',
          hoverable && 'hover:-translate-y-1 hover:shadow-natural-hover',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export { Card };
```

#### 6. Input 组件实现

```tsx
// src/components/ui/Input.tsx
import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, icon, ...props }, ref) => {
    return (
      <div className="relative">
        <input
          ref={ref}
          className={cn(
            'h-10 w-full rounded-full border-2 border-primary/50',
            'bg-background-light dark:bg-background-dark',
            'px-4 py-2 text-sm',
            'placeholder-text-light/60 dark:placeholder-text-dark/60',
            'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
            icon && 'pr-10',
            className
          )}
          {...props}
        />
        {icon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-light/70 dark:text-text-dark/70">
            {icon}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
```

#### 7. Badge 组件实现

```tsx
// src/components/ui/Badge.tsx
import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
          {
            'bg-primary/20 text-text-light dark:text-text-dark': variant === 'default',
            'border border-primary/50 text-text-light dark:text-text-dark': variant === 'outline',
          },
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
```

#### 8. Avatar 组件实现

```tsx
// src/components/ui/Avatar.tsx
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { HTMLAttributes, forwardRef } from 'react';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt = '头像', size = 'md', fallback, ...props }, ref) => {
    const sizeClasses = {
      sm: 'size-8',
      md: 'size-12',
      lg: 'size-24',
      xl: 'size-48',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-full overflow-hidden shadow-natural',
          'bg-primary/20',
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
          />
        ) : (
          <span className="flex items-center justify-center w-full h-full text-text-light dark:text-text-dark font-bold">
            {fallback || alt.charAt(0)}
          </span>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

export { Avatar };
```

#### 9. 组件统一导出

```typescript
// src/components/ui/index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button';

export { Card } from './Card';
export type { CardProps } from './Card';

export { Input } from './Input';
export type { InputProps } from './Input';

export { Badge } from './Badge';
export type { BadgeProps } from './Badge';

export { Avatar } from './Avatar';
export type { AvatarProps } from './Avatar';
```

### 3.4 数据流转

```
Tailwind 配置 → globals.css 组件类 → UI 组件 → 页面使用
                      ↓
              cn 工具函数（类名合并）
```

---

## 四、验收标准

- [ ] clsx 和 tailwind-merge 依赖安装完成
- [ ] src/utils/utils.ts 中的 cn 函数可正常使用
- [ ] tailwind.config.ts 主题配置完成，颜色与 UI 设计图一致
- [ ] globals.css 中定义了组件类（btn-primary、article-card 等）
- [ ] Button 组件支持 primary、secondary、outline 三种变体
- [ ] Button 组件支持 sm、md、lg 三种尺寸
- [ ] Card 组件支持悬停效果
- [ ] Input 组件支持图标插槽
- [ ] Badge 组件支持 default 和 outline 变体
- [ ] Avatar 组件支持不同尺寸和 fallback
- [ ] 所有组件支持亮色/暗色模式
- [ ] 组件导出文件 index.ts 正确导出所有组件和类型
- [ ] TypeScript 类型定义完整
- [ ] ESLint 检查通过

---

## 五、注意事项

### 5.1 边界情况

- **空内容**：Button 和 Badge 需要处理 children 为空的情况
- **长文本**：Button 文本过长时需要截断（truncate）
- **图片加载失败**：Avatar 需要显示 fallback

### 5.2 异常处理

- **图片加载错误**：Avatar 组件在图片加载失败时显示 fallback
- **类名冲突**：使用 cn 函数处理 Tailwind 类名冲突

### 5.3 兼容性

- **浏览器支持**：Chrome、Firefox、Safari、Edge 最新版本
- **暗色模式**：支持系统偏好和手动切换

### 5.4 代码规范

- 遵循 CLAUDE.md 中的 Tailwind CSS 专业使用规范
- 组件类名不超过 5 个时直接使用，超过时使用 @apply 或组件抽象
- 使用 Design Token（主题配置）而非硬编码颜色值

---

## 六、关联信息

- **下一步骤**：步骤3 - 布局组件开发
- **相关文档**：
  - `docs/UI/首页.html`（UI 设计参考）
  - `CLAUDE.md`（代码规范）
  - `docs/技术文档/博客系统技术方案.md`
