/**
 * 关于我页面 - 联系方式与社交链接
 */
import type { AboutContactInfo, AboutSocialLinks } from '../types';

interface AboutContactProps {
  contactInfo: AboutContactInfo | null;
  socialLinks: AboutSocialLinks | null;
}

/** 联系方式图标映射 */
const CONTACT_ICONS: Record<string, { icon: string; label: string }> = {
  email: { icon: 'mail', label: '电子邮件' },
  github: { icon: 'code', label: 'GitHub' },
  wechat: { icon: 'chat', label: '微信' },
};

export default function AboutContact({
  contactInfo,
  socialLinks,
}: AboutContactProps) {
  const hasContact = contactInfo
    && Object.values(contactInfo).some(Boolean);
  const hasSocial = socialLinks
    && Object.values(socialLinks).some(Boolean);

  if (!hasContact && !hasSocial) return null;

  const contactEntries = hasContact
    ? Object.entries(contactInfo!).filter(([, v]) => v)
    : [];

  return (
    <section className="text-center">
      <h2 className="mb-8 text-3xl font-bold text-wood-dark dark:text-text-dark">
        与我联系
      </h2>
      {contactEntries.length > 0 && (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {contactEntries.map(([key, value]) => {
            const meta = CONTACT_ICONS[key] || {
              icon: 'link',
              label: key,
            };
            const isLast = contactEntries.length === 3
              ? false
              : contactEntries.findIndex(([k]) => k === key)
              === contactEntries.length - 1;

            return (
              <div
                key={key}
                className={`flex flex-col items-center rounded-xl bg-off-white p-6 shadow-natural transition-transform duration-300 hover:scale-105 hover:shadow-natural-hover dark:bg-background-dark/50 ${isLast && contactEntries.length % 2 === 1 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
              >
                <span className="material-symbols-outlined text-4xl text-cta-light dark:text-cta-dark">
                  {meta.icon}
                </span>
                <h3 className="mt-4 text-lg font-semibold">{meta.label}</h3>
                <p className="text-text-light/80 dark:text-text-dark/80">
                  {value}
                </p>
              </div>
            );
          })}
        </div>
      )}
      {hasSocial && (
        <div className="mt-8 flex justify-center space-x-4">
          {socialLinks!.twitter && (
            <a
              href={socialLinks!.twitter}
              aria-label="Twitter"
              className="group flex h-12 w-12 items-center justify-center rounded-full bg-off-white text-text-light shadow-natural transition-all duration-300 hover:bg-[#1DA1F2] hover:text-white dark:bg-background-dark/50 dark:text-text-dark dark:hover:bg-[#1DA1F2]"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          )}
          {socialLinks!.dribbble && (
            <a
              href={socialLinks!.dribbble}
              aria-label="Dribbble"
              className="group flex h-12 w-12 items-center justify-center rounded-full bg-off-white text-text-light shadow-natural transition-all duration-300 hover:bg-[#EA4C89] hover:text-white dark:bg-background-dark/50 dark:text-text-dark dark:hover:bg-[#EA4C89]"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.62 14.54c-1.37-2.9-4.14-5.35-7.55-6.8-2.07.2-4.04.88-5.74 1.9.11-.64.29-1.29.54-1.92.74-2.01 2.2-3.83 4.1-5.18 2.4-1.68 5.23-2.5 7.9-2.3.1.28.18.57.25.86-1.9.22-3.81.79-5.55 1.68-1.55.8-2.9 1.95-3.95 3.33-.2.25-.4.51-.58.79.9-.17 1.83-.26 2.76-.26 3.01 0 5.8.98 8.1 2.68.12.33.22.67.29 1.01z" />
              </svg>
            </a>
          )}
          {socialLinks!.instagram && (
            <a
              href={socialLinks!.instagram}
              aria-label="Instagram"
              className="group flex h-12 w-12 items-center justify-center rounded-full bg-off-white text-text-light shadow-natural transition-all duration-300 hover:bg-gradient-to-bl hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 hover:text-white dark:bg-background-dark/50 dark:text-text-dark"
            >
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2c2.715 0 3.056.012 4.122.06 1.065.048 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.066.06 1.407.06 4.122s-.012 3.056-.06 4.122c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.066.048-1.407.06-4.122.06s-3.056-.012-4.122-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.066-.06-1.407-.06-4.122s.012-3.056.06-4.122c.049-1.065.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.944 2.012 9.285 2 12 2zm0 5a5 5 0 100 10 5 5 0 000-10zm0 8.333a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm5.338-9.87a1.262 1.262 0 100 2.524 1.262 1.262 0 000-2.524z"
                />
              </svg>
            </a>
          )}
        </div>
      )}
    </section>
  );
}
