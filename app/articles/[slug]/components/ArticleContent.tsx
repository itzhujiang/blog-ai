'use client';

import { type ReactNode, type ReactElement, useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import 'highlight.js/styles/github-dark.css';

export interface ArticleContentProps {
  content: string;
}

/**
 * 代码块复制按钮组件
 */
function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 降级：使用旧版 API
      const textarea = document.createElement('textarea');
      textarea.value = code;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [code]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="absolute top-2 right-2 z-10 rounded-md
        bg-primary/20 px-2 py-1 text-xs font-medium
        text-text-light/80 dark:text-text-dark/80
        opacity-0 group-hover:opacity-100
        hover:bg-primary/40 transition-all"
      aria-label="复制代码"
    >
      {copied ? '已复制' : '复制'}
    </button>
  );
}

/**
 * 从 children 中提取纯文本
 */
function extractText(children: ReactNode): string {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(extractText).join('');
  if (children && typeof children === 'object' && 'props' in children) {
    return extractText((children as ReactElement<{ children?: ReactNode }>).props.children);
  }
  return '';
}

/**
 * 文章内容 Markdown 渲染组件（客户端组件）
 */
export function ArticleContent({ content }: ArticleContentProps) {
  return (
    <div className="article-prose prose prose-lg max-w-none
      prose-headings:text-[#5a472b] dark:prose-headings:text-text-dark
      prose-p:text-text-light dark:prose-p:text-text-dark/90
      prose-a:text-cta-light dark:prose-a:text-cta-dark
      prose-strong:text-[#5a472b] dark:prose-strong:text-text-dark
      prose-blockquote:border-primary/50
      prose-blockquote:text-text-light/80 dark:prose-blockquote:text-text-dark/80
      prose-code:text-[#5a472b] dark:prose-code:text-primary
      prose-img:rounded-lg prose-img:shadow-natural"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          pre({ children, ...props }) {
            const code = extractText(children);
            return (
              <div className="relative group">
                <CopyButton code={code} />
                <pre {...props}>{children}</pre>
              </div>
            );
          },
          a({ href, children, ...props }) {
            const isExternal = href?.startsWith('http');
            return (
              <a
                href={href}
                {...(isExternal
                  ? { target: '_blank', rel: 'noopener noreferrer' }
                  : {})}
                {...props}
              >
                {children}
              </a>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
