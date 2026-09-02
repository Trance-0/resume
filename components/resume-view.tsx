'use client';

import { BriefcaseBusiness, CalendarDays, ExternalLink, GraduationCap, MapPin, Presentation, Printer } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import type { ResumeData } from '@/lib/types';

type Section = 'education' | 'experience' | 'talks';

export function ResumeViewClient({ resume }: { resume: ResumeData }) {
  const [section, setSection] = useState<Section>('education');
  return (
    <section className="resume-view">
      <div className="resume-toolbar no-print">
        <div className="resume-tabs" role="tablist" aria-label="Resume section">
          <button type="button" role="tab" aria-selected={section === 'education'} onClick={() => setSection('education')}><GraduationCap size={17} /> Education</button>
          <button type="button" role="tab" aria-selected={section === 'experience'} onClick={() => setSection('experience')}><BriefcaseBusiness size={17} /> Experience</button>
          <button type="button" role="tab" aria-selected={section === 'talks'} onClick={() => setSection('talks')}><Presentation size={17} /> Talks</button>
        </div>
        <div className="resume-actions">
          <button type="button" onClick={() => window.print()}><Printer size={16} /> Print</button>
        </div>
      </div>

      <div className="print-resume-heading">
        <h2>{resume.basics.name}</h2>
        <p>{resume.basics.email} · {resume.basics.website}</p>
      </div>

      <div className="resume-panel" role="tabpanel">
        {section === 'education' && <Education resume={resume} />}
        {section === 'experience' && <Experience resume={resume} />}
        {section === 'talks' && <Talks resume={resume} />}
      </div>

      <div className="print-only print-sections">
        <Education resume={resume} />
        <Experience resume={resume} />
        <Talks resume={resume} />
      </div>
    </section>
  );
}

function Education({ resume }: { resume: ResumeData }) {
  return (
    <div className="timeline-section">
      <div className="section-intro"><span>01</span><div><h2>Education</h2><p>Two disciplines, one practice: connect formal reasoning to systems that can be built and tested.</p></div></div>
      <div className="timeline-list">
        {resume.education.map((item, index) => (
          <motion.article key={`${item.area}-${item.studyType}`} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.08 }}>
            <div className="timeline-marker" />
            <div className="timeline-date"><CalendarDays size={14} /> {item.startDate} — {item.endDate}</div>
            <h3>{item.studyType} in {item.area}</h3>
            <p className="timeline-place">{item.institution}</p>
            <div className="education-metrics">
              {item.majorGpa && <span><strong>{item.majorGpa}</strong> Major GPA</span>}
              {item.cumulativeGpa && <span><strong>{item.cumulativeGpa}</strong> Cumulative GPA</span>}
            </div>
            <div className="tag-row">{item.focus?.map((focus) => <span key={focus}>{focus}</span>)}</div>
          </motion.article>
        ))}
      </div>
      <LanguageStrip resume={resume} />
    </div>
  );
}

function Experience({ resume }: { resume: ResumeData }) {
  return (
    <div className="timeline-section">
      <div className="section-intro"><span>02</span><div><h2>Teaching and academic work</h2><p>Experience centered on making algorithms, vision, language models, and linear algebra understandable.</p></div></div>
      <div className="timeline-list">
        {resume.work.map((item, index) => (
          <motion.article key={`${item.position}-${item.startDate}`} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.045 }}>
            <div className="timeline-marker" />
            <div className="timeline-date"><CalendarDays size={14} /> {item.startDate} — {item.endDate ?? 'Present'}</div>
            <h3>{item.position}</h3>
            <p className="timeline-place">{item.company}</p>
            {item.location && <p className="timeline-location"><MapPin size={13} /> {item.location}</p>}
            {item.summary && <p>{item.summary}</p>}
            <div className="tag-row compact">{item.category?.map((category) => <span key={category}>{category}</span>)}</div>
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function Talks({ resume }: { resume: ResumeData }) {
  return (
    <div className="timeline-section">
      <div className="section-intro"><span>03</span><div><h2>Research communication</h2><p>Presentations are treated as checkpoints: an idea is not finished until it can be explained.</p></div></div>
      <div className="timeline-list">
        {resume.presentations.map((talk, index) => (
          <motion.article key={talk.name} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.045 }}>
            <div className="timeline-marker" />
            <div className="timeline-date"><CalendarDays size={14} /> {talk.date}</div>
            <h3>{talk.name}</h3>
            <p className="timeline-place">{talk.event}</p>
            {talk.description && <p>{talk.description}</p>}
            {talk.url && <a className="inline-link" href={talk.url} target="_blank" rel="noreferrer">Open presentation <ExternalLink size={13} /></a>}
          </motion.article>
        ))}
      </div>
    </div>
  );
}

function LanguageStrip({ resume }: { resume: ResumeData }) {
  return (
    <div className="language-strip">
      <p>Languages</p>
      {resume.languages.map((language) => <span key={language.name}><strong>{language.name}</strong>{language.level}</span>)}
    </div>
  );
}
