'use client';

import { Check, ChevronDown, Copy, ExternalLink, Search, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'motion/react';
import { useMemo, useState } from 'react';
import type { Project } from '@/lib/types';

type Narrative = 'plain' | 'star' | 'tldr';

const tagLabels: Record<string, string> = {
  'full-stack': 'Full stack',
  'front-end': 'Front end',
  'back-end': 'Back end',
  'machine-learning': 'Machine learning',
  'data-analysis': 'Data analysis',
  'data-visualization': 'Data visualization',
  'game-development': 'Game development',
  'game-design': 'Game design',
  'project-management': 'Project management',
  'event-planning': 'Event planning',
  devops: 'DevOps',
  algorithm: 'Algorithms',
  robotics: 'Robotics',
  mobile: 'Mobile',
  'ui-design': 'UI design',
};

export function PortfolioExplorerClient({ projects }: { projects: Project[] }) {
  const [narrative, setNarrative] = useState<Narrative>('plain');
  const [tag, setTag] = useState('all');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState(false);

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    projects.flatMap((project) => project['job-tags'] ?? []).forEach((item) => counts.set(item, (counts.get(item) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [projects]);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesTag = tag === 'all' || project['job-tags']?.includes(tag);
      const haystack = [
        project.name,
        project.category,
        project.organization,
        project.topicCategory?.join(' '),
        project.skills?.join(' '),
        project['description-keys']?.join(' '),
      ].join(' ').toLowerCase();
      return matchesTag && (!needle || haystack.includes(needle));
    });
  }, [projects, query, tag]);

  return (
    <section className="portfolio-explorer">
      <div className="explorer-toolbar">
        <div className="narrative-tabs" role="tablist" aria-label="Project narrative format">
          {(['plain', 'star', 'tldr'] as Narrative[]).map((mode) => (
            <button key={mode} role="tab" type="button" aria-selected={narrative === mode} onClick={() => setNarrative(mode)}>
              {mode === 'plain' ? 'Overview' : mode === 'star' ? 'STAR evidence' : 'TL;DR'}
            </button>
          ))}
        </div>
        <label className="project-search">
          <Search size={17} aria-hidden="true" />
          <span className="sr-only">Search projects</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search work, tools, topics…" />
        </label>
      </div>

      <div className="filter-region">
        <div className="filter-heading">
          <p><SlidersHorizontal size={16} /> Filter by capability</p>
          <span aria-live="polite">{visible.length} of {projects.length} projects</span>
        </div>
        <div className={expanded ? 'filter-chips is-expanded' : 'filter-chips'}>
          <button type="button" aria-pressed={tag === 'all'} onClick={() => setTag('all')}>All <span>{projects.length}</span></button>
          {tags.map(([item, count]) => (
            <button key={item} type="button" aria-pressed={tag === item} onClick={() => setTag(item)}>
              {tagLabels[item] ?? item.replaceAll('-', ' ')} <span>{count}</span>
            </button>
          ))}
        </div>
        {tags.length > 8 && (
          <button className="filter-more" type="button" onClick={() => setExpanded((value) => !value)}>
            {expanded ? 'Show fewer filters' : 'Show all filters'} <ChevronDown size={15} />
          </button>
        )}
      </div>

      <motion.div className="project-list" layout>
        <AnimatePresence mode="popLayout">
          {visible.map((project, index) => (
            <ProjectCard key={project.name} project={project} narrative={narrative} index={index} />
          ))}
        </AnimatePresence>
      </motion.div>
      {visible.length === 0 && <div className="empty-state">No projects match this combination. Try a broader term or reset the filter.</div>}
    </section>
  );
}

function ProjectCard({ project, narrative, index }: { project: Project; narrative: Narrative; index: number }) {
  const [copied, setCopied] = useState(false);
  const slug = project.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const plainText = project['description-keys']?.join('\n') ?? '';
  const starText = project.star
    ? Object.entries(project.star).map(([key, value]) => `${key[0].toUpperCase()}${key.slice(1)}: ${value}`).join('\n')
    : plainText;
  const copyText = narrative === 'star' ? starText : narrative === 'tldr' ? project.tldr ?? plainText : plainText;

  async function copy() {
    await navigator.clipboard.writeText(copyText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  return (
    <motion.article
      id={slug}
      className="project-card"
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: Math.min(index, 6) * 0.035 }}
    >
      <Link className="project-card-overlay" href={`/projects/${project.slug}/`} aria-label={`Open ${project.name} project page`} />
      <div className="project-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</div>
      <div className="project-card-main">
        <div className="project-meta">
          <span>{project.topicCategory?.join(' · ') ?? project.category}</span>
          <time>{project.date}</time>
        </div>
        <div className="project-title-row">
          <h2>{project.name}</h2>
          <button className="copy-button" type="button" onClick={copy} aria-label={`Copy ${project.name} summary`}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
        {project.organization && <p className="project-organization">{project.organization}</p>}

        <div className="project-narrative">
          {narrative === 'plain' && (
            <ul>{project['description-keys']?.map((description) => <li key={description}>{description}</li>)}</ul>
          )}
          {narrative === 'star' && project.star && (
            <dl className="star-grid">
              {Object.entries(project.star).map(([key, value]) => value && (
                <div key={key}><dt>{key}</dt><dd>{value}</dd></div>
              ))}
            </dl>
          )}
          {narrative === 'star' && !project.star && <p>{project.tldr ?? plainText}</p>}
          {narrative === 'tldr' && <p className="tldr">{project.tldr ?? project['description-keys']?.[0]}</p>}
        </div>

        <div className="project-footer">
          <div className="tag-row compact">
            {project.skills?.slice(0, 6).map((skill) => <span key={skill}>{skill}</span>)}
          </div>
          {project.links && project.links.length > 0 && (
            <div className="project-links">
              {project.links.map((link) => (
                <a key={link.url} href={link.url} target="_blank" rel="noreferrer">{link.label} <ExternalLink size={13} /></a>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.article>
  );
}
