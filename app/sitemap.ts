import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';
import { resume, site } from '@/lib/content';

export const dynamic = 'force-static';

function absoluteUrl(path: string) {
  return new URL(path.replace(/^\//, ''), site.siteUrl).toString();
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = source.getPages().map((page) => ({
    url: absoluteUrl(page.url),
    changeFrequency: page.url === '/' ? 'monthly' : 'yearly',
    priority: page.url === '/' ? 1 : 0.7,
  }));
  const projects = resume.portfolio.map((project) => ({
    url: absoluteUrl(`/projects/${project.slug}/`),
    changeFrequency: 'yearly' as const,
    priority: 0.6,
  }));
  return [...pages, ...projects];
}
