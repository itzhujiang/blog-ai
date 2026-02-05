import Image from 'next/image';
import Link from 'next/link';

/**
 * AI 画廊项目接口
 */
export interface GalleryItem {
  id: number;
  imageUrl: string;
  alt: string;
}

export interface AiGalleryPreviewProps {
  items: GalleryItem[];
}

/**
 * AI 艺术画廊预览组件
 * 横向滚动展示 AI 艺术作品
 */
export function AiGalleryPreview({ items }: AiGalleryPreviewProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">AI 艺术画廊</h2>
        <Link
          href="/gallery"
          className="text-sm text-primary hover:underline"
        >
          查看全部 →
        </Link>
      </div>

      {/* 横向滚动容器 */}
      <div className="-mx-6 px-6 sm:-mx-8 sm:px-8">
        <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 scrollbar-hide">
          {items.map((item) => (
            <Link
              key={item.id}
              href="/gallery"
              className="w-2/3 flex-shrink-0 snap-center sm:w-1/2 lg:w-1/3"
            >
              <div className="relative aspect-square overflow-hidden rounded-lg border-2 border-primary/30 shadow-natural transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-natural-hover">
                <Image
                  src={item.imageUrl}
                  alt={item.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 66vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
