/**
 * 关于我页面 - 成长足迹时间线
 */
import type { AboutTimelineItem } from '../types';

interface AboutTimelineProps {
  timeline: AboutTimelineItem[] | null;
}

/** 将时间戳格式化为 YYYY.MM.DD */
function formatDate(timestamp: number): string {
  const date = new Date(timestamp);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

export default function AboutTimeline({ timeline }: AboutTimelineProps) {
  if (!timeline || timeline.length === 0) return null;

  // 按 timestamp 倒序排列（最新在前）
  const sorted = [...timeline].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <section>
      <h2 className="mb-12 text-center text-3xl font-bold text-wood-dark dark:text-text-dark">
        成长足迹
      </h2>
      <div className="max-h-[600px] overflow-y-auto scrollbar-hide">
        <div className="relative mx-auto max-w-2xl pl-8">
          <div className="absolute left-2.5 top-0 h-full w-0.5 bg-wood-light dark:bg-primary/30" />
          {sorted.map((item, index) => (
            <div
              key={item.timestamp}
              className={`relative transition-all duration-300 hover:pl-2 ${index < sorted.length - 1 ? 'mb-10' : ''}`}
            >
              <span className="mb-1 block text-xs font-medium text-text-light/70 dark:text-text-dark/70">
                {formatDate(item.timestamp)}
              </span>
              <div className="absolute left-1 top-6 z-10 h-3 w-3 rounded-full bg-primary" />
              <div className="ml-8 rounded-xl border border-primary/20 bg-background-light p-6 shadow-natural transition-shadow duration-300 hover:shadow-natural-hover dark:border-primary/30 dark:bg-background-dark/50">
                <h3 className="text-lg font-semibold text-wood-dark dark:text-text-dark">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-text-light/80 dark:text-text-dark/80">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
