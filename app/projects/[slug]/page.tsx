import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, CalendarDays } from 'lucide-react';
import { projects as projectDocuments } from 'collections/server';
import { getMDXComponents } from '@/components/mdx-components';
import { PageShell } from '@/components/page-shell';
import { resume, site, slugify } from '@/lib/content';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

function getProject(slug: string) {
  const document = projectDocuments.find((item) => slugify(item.title) === slug);
  const project = resume.portfolio.find((item) => item.slug === slug);
  return document && project ? { document, project } : null;
}

export function generateStaticParams() {
  return projectDocuments.map((project) => ({ slug: slugify(project.title) }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = getProject(slug);
  if (!result) return {};
  return {
    title: result.project.name,
    description: result.project.tldr ?? result.project['description-keys']?.[0],
    alternates: {
      canonical: new URL(`projects/${slug}/`, site.siteUrl).toString(),
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const result = getProject(slug);
  if (!result) notFound();

  const { document, project } = result;
  const Content = document.body;

  return (
    <PageShell
      title={project.name}
      description={project.tldr}
      eyebrow={project.category ?? 'Project'}
      layout="article"
      toc={document.toc}
    >
      <Link className="project-back-link" href="/portfolio/"><ArrowLeft size={15} /> Back to all projects</Link>
      <div className="project-detail-meta">
        {project.date && <span><CalendarDays size={15} /> {project.date}</span>}
        {project.organization && <span>{project.organization}</span>}
      </div>
      <div className="tag-row project-detail-tags">
        {project.skills?.map((skill) => <span key={skill}>{skill}</span>)}
      </div>
      <Content components={getMDXComponents()} />
      {project.links && project.links.length > 0 && (
        <section className="project-detail-links" aria-label="Project resources">
          <h2>Resources</h2>
          <div>
            {project.links.map((link) => (
              <a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label} <ArrowUpRight size={14} /></a>
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
}
