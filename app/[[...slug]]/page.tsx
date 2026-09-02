import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { source } from '@/lib/source';
import { site } from '@/lib/content';
import { getMDXComponents } from '@/components/mdx-components';
import { PageShell } from '@/components/page-shell';

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug = [] } = await params;
  const page = source.getPage(slug);
  if (!page) return {};
  return {
    title: page.data.title,
    description: page.data.description,
    alternates: {
      canonical: new URL(page.url.replace(/^\//, ''), site.siteUrl).toString(),
    },
  };
}

export default async function ContentPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const page = source.getPage(slug);
  if (!page) notFound();

  const Content = page.data.body;
  return (
    <PageShell
      title={page.data.title}
      description={page.data.description}
      eyebrow={page.data.eyebrow}
      layout={page.data.layout}
      toc={page.data.toc}
    >
      <Content components={getMDXComponents()} />
    </PageShell>
  );
}
