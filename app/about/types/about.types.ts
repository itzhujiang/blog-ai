/**
 * 关于我页面类型定义
 */

export interface AboutSkillItem {
  name: string;
  level: number;
}

export interface AboutSkillGroup {
  category: string;
  items: AboutSkillItem[];
}

export interface AboutTimelineItem {
  timestamp: number;
  title: string;
  description: string;
}

export interface AboutContactInfo {
  email?: string;
  github?: string;
  wechat?: string;
  [key: string]: string | undefined;
}

export interface AboutSocialLinks {
  twitter?: string;
  dribbble?: string;
  instagram?: string;
  [key: string]: string | undefined;
}

export interface AboutPageData {
  nickname: string | null;
  jobTitle: string | null;
  personalTags: string[] | null;
  avatarUrl: string | null;
  introContent: string;
  skills: AboutSkillGroup[] | null;
  timeline: AboutTimelineItem[] | null;
  contactInfo: AboutContactInfo | null;
  socialLinks: AboutSocialLinks | null;
}
