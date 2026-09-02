import {
  education as educationDocuments,
  experience as experienceDocuments,
  profile as profileDocuments,
  pathwaySettings as pathwayDocuments,
  projects as projectDocuments,
  qaSettings as qaSettingsDocuments,
  questions as questionDocuments,
  semesters as semesterDocuments,
  siteSettings as siteDocuments,
  talks as talkDocuments,
} from 'collections/server';
import type { ResumeData, SiteData } from '@/lib/types';
import { slugify } from '@/lib/slug';

export { slugify } from '@/lib/slug';

function first<T>(items: T[], label: string): T {
  const item = items[0];
  if (!item) throw new Error(`Missing required MDX content: ${label}`);
  return item;
}

function byOrder<T extends { order: number }>(items: T[]) {
  return [...items].sort((a, b) => b.order - a.order);
}

function projectDateValue(date?: string) {
  if (!date) return Number.NEGATIVE_INFINITY;
  const [start = '', end = ''] = date.split(/\s+[–-]\s+/);
  const selected = /^(present|current)$/i.test(end.trim()) ? start : end || start;
  const match = selected.trim().match(/^(?:(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+)?(\d{4})$/i);
  if (!match) return Number.NEGATIVE_INFINITY;
  const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  const month = match[1] ? months.indexOf(match[1].toLowerCase()) : 0;
  return Date.UTC(Number(match[2]), month, 1);
}

function byProjectDate<T extends { date?: string; order: number }>(items: T[]) {
  return [...items].sort((a, b) => projectDateValue(b.date) - projectDateValue(a.date) || b.order - a.order);
}

const siteDocument = first(siteDocuments, 'content/site/index.mdx');
const pathwayDocument = first(pathwayDocuments, 'content/pathways/index.mdx');
const profileDocument = first(profileDocuments, 'content/resume/profile/index.mdx');
const qaDocument = first(qaSettingsDocuments, 'content/resume/qa-settings/index.mdx');

export const site: SiteData = {
  name: siteDocument.name,
  descriptor: siteDocument.descriptor,
  email: siteDocument.email,
  siteUrl: siteDocument.siteUrl,
  hero: siteDocument.hero,
  navigation: siteDocument.navigation,
  profiles: siteDocument.profiles,
  inquiries: siteDocument.inquiries,
  pathways: pathwayDocument.pathways,
};

export const resume: ResumeData = {
  basics: {
    name: profileDocument.name,
    email: profileDocument.email,
    phone: profileDocument.phone,
    website: profileDocument.website,
    summary: profileDocument.summary,
    profiles: profileDocument.profiles,
  },
  work: byOrder(experienceDocuments).map((item) => ({
    company: item.company,
    position: item.title,
    location: item.location,
    startDate: item.startDate,
    endDate: item.endDate,
    summary: item.summary,
    highlights: item.highlights,
    category: item.category,
  })),
  education: byOrder(educationDocuments).map((item) => ({
    institution: item.title,
    area: item.area,
    studyType: item.studyType,
    startDate: item.startDate,
    endDate: item.endDate,
    majorGpa: item.majorGpa,
    cumulativeGpa: item.cumulativeGpa,
    gpa: item.gpa,
    focus: item.focus,
    category: item.category,
  })),
  skills: byOrder(semesterDocuments).map((item) => ({
    semesters: item.title,
    courses: item.courses,
  })),
  languages: profileDocument.languages,
  presentations: byOrder(talkDocuments).map((item) => ({
    name: item.title,
    event: item.event,
    date: item.date,
    location: item.location,
    description: item.description,
    url: item.url,
    skills: item.skills,
    category: item.category,
  })),
  portfolio: byProjectDate(projectDocuments).map((item) => ({
    name: item.title,
    slug: slugify(item.title),
    category: item.category,
    topicCategory: item.topicCategory,
    date: item.date,
    organization: item.organization,
    'description-keys': item.highlights,
    skills: item.skills,
    links: item.links,
    star: item.star,
    tldr: item.tldr,
    'job-tags': item.jobTags,
  })),
  qa: {
    title: qaDocument.title,
    blurb: qaDocument.blurb,
    intro: qaDocument.intro,
    last_updated: qaDocument.updated,
    items: byOrder(questionDocuments).map((item) => ({
      question: item.title,
      answer: item.answer,
    })),
  },
};

export function formatDateRange(start: string, end?: string) {
  const format = (value: string) => {
    if (/^(present|current)$/i.test(value)) return 'Present';
    const [year, month] = value.split('-');
    if (!month) return year;
    const date = new Date(Number(year), Number(month) - 1, 1);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: 'numeric',
    }).format(date);
  };
  return end ? `${format(start)} – ${format(end)}` : format(start);
}
