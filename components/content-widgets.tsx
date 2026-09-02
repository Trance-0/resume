'use client';

import Link from 'next/link';
import { BookOpen, Check, ChevronDown, Copy, ExternalLink, MapPin, Presentation, Route } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { withBasePath } from '@/lib/base-path';
import type { Presentation as Talk, Project, QAItem, SiteData, SkillSemester } from '@/lib/types';
import { courseAnchor } from '@/lib/slug';

export function TalksArchiveClient({ talks }: { talks: Talk[] }) {
  return (
    <div className="talks-archive">
      {talks.map((talk, index) => (
        <motion.article key={talk.name} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="talk-date"><span>{talk.date.slice(0, 4)}</span><small>{talk.date}</small></div>
          <div className="talk-body">
            <p className="eyebrow"><Presentation size={14} /> {talk.event}</p>
            <h2>{talk.name}</h2>
            {talk.location && <p className="talk-location"><MapPin size={14} /> {talk.location}</p>}
            {talk.description && <p>{talk.description}</p>}
            <div className="talk-footer">
              <div className="tag-row compact">{talk.skills?.map((skill) => <span key={skill}>{skill}</span>)}</div>
              {talk.url && <a href={localizeFile(talk.url)} target="_blank" rel="noreferrer">Open resource <ExternalLink size={13} /></a>}
            </div>
          </div>
          <span className="talk-index" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        </motion.article>
      ))}
    </div>
  );
}

function localizeFile(url: string) {
  const match = url.match(/\/files\/([^/]+\.pdf)$/i);
  return match ? withBasePath(`/files/${match[1]}`) : url;
}

interface PathwayProps {
  pathways: SiteData['pathways'];
  projects: Project[];
  semesters: SkillSemester[];
}

interface ResolvedPathwayItem {
  type: 'project' | 'course';
  title: string;
  description?: string;
  href: string;
}

export function PathwaysClient({ pathways, projects, semesters }: PathwayProps) {
  const [open, setOpen] = useState(0);

  return (
    <div className="pathways">
      {pathways.map((pathway, index) => {
        const expanded = open === index;
        const relatedItems = pathway.items.reduce<ResolvedPathwayItem[]>((items, selection) => {
          if (selection.type === 'project') {
            const project = projects.find((item) => item.slug === selection.slug);
            if (project) items.push({ type: 'project', title: project.name, description: project.tldr, href: `/projects/${project.slug}/` });
            return items;
          }
          const semester = semesters.find((item) => item.semesters === selection.semester);
          const course = semester?.courses.find((item) => item.name === selection.course);
          if (course) items.push({ type: 'course', title: course.name, description: `${selection.semester} · ${course.level ?? 'Course'}`, href: `/skills/#${courseAnchor(selection.semester, course.name)}` });
          return items;
        }, []);
        return (
          <section key={pathway.title} className={expanded ? 'pathway is-open' : 'pathway'}>
            <button type="button" onClick={() => setOpen(expanded ? -1 : index)} aria-expanded={expanded}>
              <span className="pathway-number">0{index + 1}</span>
              <span><strong>{pathway.title}</strong><small>{pathway.description}</small></span>
              <ChevronDown size={21} />
            </button>
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div className="pathway-panel" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <div className="pathway-list">
                    <p className="eyebrow">Connected work · {relatedItems.length}</p>
                    {relatedItems.map((item) => (
                      <Link key={`${item.type}-${item.href}`} href={item.href}>
                        {item.type === 'project' ? <Route size={15} /> : <BookOpen size={15} />}
                        <span><strong>{item.title}</strong><small><b>{item.type}</b>{item.description ? ` · ${item.description}` : ''}</small></span>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        );
      })}
    </div>
  );
}

export function QAListClient({ items, updated }: { items: QAItem[]; updated?: string }) {
  return (
    <div className="qa-list">
      {updated && <p className="qa-updated">Last updated {updated}</p>}
      {items.map((item, index) => <QAEntry key={item.question} item={item} index={index} />)}
    </div>
  );
}

function renderInlineMarkdown(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));
    const token = match[0];
    if (token.startsWith('**')) {
      nodes.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    } else {
      const link = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        const label = link[1];
        const href = link[2];
        nodes.push(/^(https?:)?\/\//.test(href)
          ? <a key={key++} href={href} target="_blank" rel="noreferrer">{label}</a>
          : <Link key={key++} href={href}>{label}</Link>);
      } else {
        nodes.push(token);
      }
    }
    lastIndex = pattern.lastIndex;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function stripInlineMarkdown(text: string) {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
}

function QAEntry({ item, index }: { item: QAItem; index: number }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(stripInlineMarkdown(item.answer));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }
  return (
    <section className="qa-entry">
      <button className="qa-question" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
        <span>Q{String(index + 1).padStart(2, '0')}</span><strong>{item.question}</strong><ChevronDown size={20} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div className="qa-answer" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            <button type="button" onClick={copy}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copied' : 'Copy answer'}</button>
            {item.answer.split(/\n\n+/).map((paragraph) => <p key={paragraph.slice(0, 48)}>{renderInlineMarkdown(paragraph)}</p>)}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export function SitemapGridClient({ navigation }: { navigation: SiteData['navigation'] }) {
  return (
    <div className="sitemap-grid">
      {navigation.map((item, index) => (
        <Link key={item.href} href={item.href}><span>0{index + 1}</span><strong>{item.label}</strong><ExternalLink size={15} /></Link>
      ))}
      <Link href="/terms/"><span>{String(navigation.length + 1).padStart(2, '0')}</span><strong>Terms and privacy</strong><ExternalLink size={15} /></Link>
    </div>
  );
}
