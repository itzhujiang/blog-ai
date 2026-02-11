import type { Metadata } from 'next';

import { getAboutPageData } from '@/services';

import {
  AboutHero,
  AboutProfile,
  AboutSkills,
  AboutTimeline,
  AboutContact,
} from './components';

// SSG: 静态生成
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: '关于我 - 暖木博客',
  description: '认识一下，这是我的数字家园',
};

export default async function AboutPage() {
  const data = await getAboutPageData();

  if (!data) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center py-16">
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-primary/50">
            edit_note
          </span>
          <p className="mt-4 text-lg text-text-light/80 dark:text-text-dark/80">
            页面内容正在准备中...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full flex-grow py-8 md:py-16">
      <div className="mx-auto max-w-[1200px] space-y-16 md:space-y-24">
        <AboutHero />
        <AboutProfile
          nickname={data.nickname}
          jobTitle={data.jobTitle}
          personalTags={data.personalTags}
          avatarUrl={data.avatarUrl}
          introContent={data.introContent}
        />
        <AboutSkills skills={data.skills} />
        <AboutTimeline timeline={data.timeline} />
        <AboutContact
          contactInfo={data.contactInfo}
          socialLinks={data.socialLinks}
        />
      </div>
    </main>
  );
}
