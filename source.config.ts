import { defineCollections, defineConfig, defineDocs } from 'fumadocs-mdx/config';
import { pageSchema } from 'fumadocs-core/source/schema';
import { z } from 'zod';

const profileLinkSchema = z.object({
  network: z.string(),
  username: z.string(),
  url: z.url(),
});

const navigationLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
});

const courseSchema = z.object({
  name: z.string(),
  level: z.string().optional(),
  category: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  description: z.string().optional(),
  textbooks: z.array(z.object({ name: z.string(), url: z.string() })).optional(),
});

export const pages = defineDocs({
  dir: 'content/pages',
  docs: {
    schema: pageSchema.extend({
      eyebrow: z.string().optional(),
      layout: z.enum(['landing', 'article', 'wide']).default('article'),
      featured: z.boolean().default(false),
    }),
  },
});

export const siteSettings = defineCollections({
  type: 'doc',
  dir: 'content/site',
  schema: z.object({
    title: z.string(),
    name: z.string(),
    descriptor: z.string(),
    email: z.email(),
    siteUrl: z.url(),
    hero: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      emphasis: z.string(),
      lead: z.string(),
      notes: z.array(z.object({ label: z.string(), value: z.string() })).min(2),
    }),
    navigation: z.array(navigationLinkSchema),
    profiles: z.array(z.object({ label: z.string(), href: z.url() })),
    inquiries: z.array(z.object({
      label: z.string(),
      title: z.string(),
      description: z.string(),
      topics: z.array(z.string()),
    })),
  }),
});

export const pathwaySettings = defineCollections({
  type: 'doc',
  dir: 'content/pathways',
  schema: z.object({
    title: z.string(),
    pathways: z.array(z.object({
      title: z.string(),
      description: z.string(),
      items: z.array(z.discriminatedUnion('type', [
        z.object({ type: z.literal('project'), slug: z.string() }),
        z.object({ type: z.literal('course'), semester: z.string(), course: z.string() }),
      ])),
    })),
  }),
});

export const profile = defineCollections({
  type: 'doc',
  dir: 'content/resume/profile',
  schema: z.object({
    title: z.string(),
    name: z.string(),
    email: z.email(),
    phone: z.string().optional(),
    website: z.url().optional(),
    summary: z.string().optional(),
    profiles: z.array(profileLinkSchema),
    languages: z.array(z.object({ name: z.string(), level: z.string() })),
  }),
});

export const education = defineCollections({
  type: 'doc',
  dir: 'content/resume/education',
  schema: z.object({
    title: z.string(),
    order: z.number(),
    area: z.string(),
    studyType: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    majorGpa: z.string().optional(),
    cumulativeGpa: z.string().optional(),
    gpa: z.string().optional(),
    focus: z.array(z.string()).optional(),
    category: z.array(z.string()).optional(),
  }),
});

export const experience = defineCollections({
  type: 'doc',
  dir: 'content/resume/experience',
  schema: z.object({
    title: z.string(),
    order: z.number(),
    company: z.string(),
    location: z.string().optional(),
    startDate: z.string(),
    endDate: z.string().optional(),
    summary: z.string().optional(),
    highlights: z.array(z.string()).optional(),
    category: z.array(z.string()).optional(),
  }),
});

export const semesters = defineCollections({
  type: 'doc',
  dir: 'content/resume/courses',
  schema: z.object({
    title: z.string(),
    order: z.number(),
    courses: z.array(courseSchema),
  }),
});

export const talks = defineCollections({
  type: 'doc',
  dir: 'content/resume/talks',
  schema: z.object({
    title: z.string(),
    order: z.number(),
    event: z.string(),
    date: z.string(),
    location: z.string().optional(),
    description: z.string().optional(),
    url: z.string().optional(),
    skills: z.array(z.string()).optional(),
    category: z.array(z.string()).optional(),
  }),
});

export const projects = defineCollections({
  type: 'doc',
  dir: 'content/resume/projects',
  schema: z.object({
    title: z.string(),
    order: z.number(),
    category: z.string().optional(),
    topicCategory: z.array(z.string()).optional(),
    date: z.string().optional(),
    organization: z.string().optional(),
    highlights: z.array(z.string()).optional(),
    skills: z.array(z.string()).optional(),
    links: z.array(z.object({ label: z.string(), url: z.string() })).optional(),
    star: z.object({
      situation: z.string().optional(),
      task: z.string().optional(),
      action: z.string().optional(),
      result: z.string().optional(),
    }).optional(),
    tldr: z.string().optional(),
    jobTags: z.array(z.string()).optional(),
  }),
});

export const qaSettings = defineCollections({
  type: 'doc',
  dir: 'content/resume/qa-settings',
  schema: z.object({
    title: z.string(),
    blurb: z.string().optional(),
    intro: z.string().optional(),
    updated: z.string().optional(),
  }),
});

export const questions = defineCollections({
  type: 'doc',
  dir: 'content/resume/questions',
  schema: z.object({
    title: z.string(),
    order: z.number(),
    answer: z.string(),
  }),
});

export default defineConfig();
