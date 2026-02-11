/**
 * 关于我页面 - 个人信息区域
 */
import Image from 'next/image';

interface AboutProfileProps {
  nickname: string | null;
  jobTitle: string | null;
  personalTags: string[] | null;
  avatarUrl: string | null;
  introContent: string;
}

export default function AboutProfile({
  nickname,
  jobTitle,
  personalTags,
  avatarUrl,
  introContent,
}: AboutProfileProps) {
  const displayName = nickname || '博主';
  const initials = displayName.charAt(0);
  const paragraphs = introContent
    .split('\n\n')
    .filter((p) => p.trim().length > 0);

  return (
    <section>
      <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-3 md:gap-16">
        <div className="flex flex-col items-center md:col-span-1 md:items-start">
          <div className="relative transition-transform duration-300 hover:scale-105">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={`${displayName}的头像`}
                width={192}
                height={192}
                className="h-48 w-48 rounded-full border-8 border-wood-light object-cover shadow-natural dark:border-primary/30"
              />
            ) : (
              <div className="flex h-48 w-48 items-center justify-center rounded-full border-8 border-wood-light bg-primary/20 text-5xl font-bold text-wood-dark shadow-natural dark:border-primary/30 dark:text-text-dark">
                {initials}
              </div>
            )}
          </div>
          <h2 className="mt-6 text-3xl font-bold text-wood-dark dark:text-text-dark">
            {displayName}
          </h2>
          {jobTitle && (
            <p className="mt-2 text-text-light/80 dark:text-text-dark/80">
              {jobTitle}
            </p>
          )}
          {personalTags && personalTags.length > 0 && (
            <div className="mt-4 flex flex-col items-center gap-2 md:items-start">
              {personalTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-primary/20 px-4 py-1.5 text-sm font-medium text-text-light transition-shadow duration-300 hover:shadow-md dark:bg-primary/30 dark:text-text-dark"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="md:col-span-2">
          <h3 className="text-3xl font-semibold text-wood-dark dark:text-text-dark">
            很高兴认识你
          </h3>
          <div className="mt-4 space-y-4 text-base leading-loose text-text-light dark:text-text-dark/90">
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
