'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';
import { withBasePath } from '@/lib/base-path';
import type { Project, SiteData } from '@/lib/types';

export function HomeHeroClient({ site, latestProject }: { site: SiteData; latestProject: Project }) {
  const projectTags = latestProject.skills?.length ? latestProject.skills : latestProject.topicCategory ?? [];
  const [currentTag] = useState(() => projectTags[Math.floor(Math.random() * projectTags.length)] ?? latestProject.category ?? 'Current project');

  return (
    <section className="hero-section">
        <div className="hero-pattern" aria-hidden="true">
          <span /><span /><span /><span /><span />
        </div>
        <div className="page-container hero-grid">
          <motion.div
            className="hero-copy"
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="eyebrow">{site.hero.eyebrow}</p>
            <h1>{site.hero.heading} <em>{site.hero.emphasis}</em></h1>
            <p className="hero-lead">{site.hero.lead}</p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/portfolio/">Explore the work <ArrowRight size={17} /></Link>
              <a className="button button-quiet" href={`mailto:${site.email}`}><Mail size={17} /> Start a conversation</a>
            </div>
          </motion.div>

          <motion.div
            className="portrait-composition"
            initial={false}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12, duration: 0.7 }}
          >
            <div className="portrait-frame">
              <Image src={withBasePath('/media/profile.jpg')} alt={`Portrait of ${site.name}`} fill priority sizes="(max-width: 760px) 70vw, 370px" />
            </div>
            <Link
              className="portrait-note note-one portrait-note-link"
              href={`/projects/${latestProject.slug}/`}
              aria-label={`Open latest project: ${latestProject.name}`}
              title={latestProject.name}
            >
              <span>{site.hero.notes[0]?.label}</span>{currentTag}
            </Link>
            <div className="portrait-note note-two"><span>{site.hero.notes[1]?.label}</span>{site.hero.notes[1]?.value}</div>
          </motion.div>
        </div>
    </section>
  );
}

export function InquiryTabsClient({ inquiries }: { inquiries: SiteData['inquiries'] }) {
  const [active, setActive] = useState(0);
  const item = inquiries[active];
  return (
    <section className="inquiry-tabs">
      <div className="inquiry-tablist" role="tablist" aria-label="Research inquiries">
        {inquiries.map((inquiry, index) => (
          <button
            key={inquiry.title}
            id={`inquiry-tab-${index}`}
            role="tab"
            type="button"
            aria-selected={active === index}
            aria-controls="inquiry-panel"
            onClick={() => setActive(index)}
          >
            <span>0{index + 1}</span>
            {inquiry.label}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={item.title}
          id="inquiry-panel"
          role="tabpanel"
          aria-labelledby={`inquiry-tab-${active}`}
          className="inquiry-panel"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2 }}
        >
          <p className="eyebrow">Question {active + 1}</p>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <div className="tag-row">{item.topics.map((topic) => <span key={topic}>{topic}</span>)}</div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}

export function FeaturedProjectsClient({ projects }: { projects: Project[] }) {
  const selected = projects.slice(0, 6);
  return (
    <div className="featured-grid">
      {selected.map((project, index) => (
        <motion.article
          key={project.name}
          className="featured-card"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ delay: (index % 3) * 0.07 }}
        >
          <Link className="featured-card-overlay" href={`/projects/${project.slug}/`} aria-label={`Open ${project.name} project page`} />
          <div className="featured-card-top">
            <span>{project.topicCategory?.[1] ?? project.category}</span>
            <small>{project.date}</small>
          </div>
          <h3>{project.name}</h3>
          <p>{project.tldr ?? project['description-keys']?.[0]}</p>
          <div className="tag-row compact">
            {project.skills?.slice(0, 3).map((skill) => <span key={skill}>{skill}</span>)}
          </div>
          <span className="featured-card-action">View project <ArrowRight size={15} /></span>
        </motion.article>
      ))}
    </div>
  );
}
