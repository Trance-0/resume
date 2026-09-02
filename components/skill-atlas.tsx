'use client';

import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  type Node,
  type NodeProps,
  type NodeTypes,
} from '@xyflow/react';
import { BookOpen, ChevronDown, Maximize2, Minimize2, Search } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { withBasePath } from '@/lib/base-path';
import type { ResumeData, SkillSemester } from '@/lib/types';
import { courseAnchor } from '@/lib/slug';

type Month = number | 'PRESENT';
type ItemKind = 'education' | 'work' | 'course' | 'course-grad' | 'portfolio' | 'presentation';

interface TimelineItem extends Record<string, unknown> {
  id: string;
  kind: ItemKind;
  title: string;
  subtitle: string;
  start: Month;
  end: Month;
  category: string[];
  tags?: string[];
  description: string;
  links: Array<{ label: string; url: string }>;
  width?: number;
  collapsed?: boolean;
  row?: number;
}

interface TimelineLane {
  top: string;
  sub: string;
  items: TimelineItem[];
  rowCount?: number;
  yStart?: number;
  yHeight?: number;
}

interface TimelineGroup {
  top: string;
  lanes: TimelineLane[];
  collapsed?: boolean;
  flatItems?: TimelineItem[];
  yStart?: number;
  yHeight?: number;
}

const months: Record<string, number> = {
  jan: 0, january: 0, feb: 1, february: 1, mar: 2, march: 2,
  apr: 3, april: 3, may: 4, jun: 5, june: 5, jul: 6, july: 6,
  aug: 7, august: 7, sep: 8, sept: 8, september: 8, oct: 9,
  october: 9, nov: 10, november: 10, dec: 11, december: 11,
};

function parseMonth(raw?: string): Month | null {
  if (!raw) return null;
  const value = raw.trim();
  if (/^(present|current|now)$/i.test(value)) return 'PRESENT';
  let match = /^(\d{4})[-/](\d{1,2})(?:[-/]\d{1,2})?$/.exec(value);
  if (match) return Number(match[1]) * 12 + Math.max(0, Math.min(11, Number(match[2]) - 1));
  match = /^(\d{4})$/.exec(value);
  if (match) return Number(match[1]) * 12;
  match = /^([A-Za-z]+)\.?\s+(\d{4})$/.exec(value);
  if (match && months[match[1].toLowerCase()] !== undefined) return Number(match[2]) * 12 + months[match[1].toLowerCase()];
  return null;
}

function semesterRange(label: string): [number, number] | null {
  const yearMatch = /(\d{4})/.exec(label);
  if (!yearMatch) return /high\s+school/i.test(label) ? [2020 * 12, 2022 * 12 + 4] : null;
  const year = Number(yearMatch[1]);
  if (/spring/i.test(label)) return [year * 12, year * 12 + 4];
  if (/summer/i.test(label)) return [year * 12 + 4, year * 12 + 7];
  if (/fall/i.test(label)) return [year * 12 + 7, year * 12 + 11];
  if (/winter/i.test(label)) return [year * 12 + 11, (year + 1) * 12];
  return [year * 12, year * 12 + 11];
}

function projectRange(value?: string): [Month, Month] | null {
  if (!value) return null;
  const parts = value.split(/\s+[-–]\s+/);
  if (parts.length === 2) {
    const start = parseMonth(parts[0]);
    const end = parseMonth(parts[1]);
    if (start !== null && end !== null) return [start, end];
  }
  const month = parseMonth(value);
  return month === null ? null : [month, month];
}

function collectItems(resume: ResumeData): TimelineItem[] {
  const items: TimelineItem[] = [];
  resume.education.forEach((entry, index) => {
    const start = parseMonth(entry.startDate);
    const end = parseMonth(entry.endDate);
    if (start === null || end === null) return;
    items.push({ id: `education-${index}`, kind: 'education', title: `${entry.studyType} in ${entry.area}`, subtitle: entry.institution, start, end, category: entry.category ?? [], description: entry.focus?.join(', ') ?? '', links: [] });
  });
  resume.work.forEach((entry, index) => {
    const start = parseMonth(entry.startDate);
    const end = parseMonth(entry.endDate);
    if (start === null || end === null) return;
    items.push({ id: `work-${index}`, kind: 'work', title: entry.position, subtitle: entry.company, start, end, category: entry.category ?? [], description: entry.summary ?? '', links: [] });
  });
  resume.skills.forEach((semester, semesterIndex) => {
    const range = semesterRange(semester.semesters);
    if (!range) return;
    semester.courses.forEach((course, courseIndex) => {
      const level = course.level?.toLowerCase() ?? '';
      const kind: ItemKind = level.includes('graduate') && !level.includes('undergraduate') || level.includes('research') ? 'course-grad' : 'course';
      items.push({ id: `course-${semesterIndex}-${courseIndex}`, kind, title: course.name, subtitle: course.level ?? '', start: range[0], end: range[1], category: course.category ?? [], tags: course.tags, description: course.description ?? '', links: course.textbooks?.map((book) => ({ label: book.name, url: book.url })) ?? [] });
    });
  });
  resume.portfolio.forEach((project, index) => {
    const range = projectRange(project.date);
    if (!range) return;
    items.push({ id: `project-${index}`, kind: 'portfolio', title: project.name, subtitle: project.category ?? '', start: range[0], end: range[1], category: project.topicCategory ?? [], tags: project.skills, description: project['description-keys']?.join(' ') ?? '', links: [{ label: 'Project page', url: `/projects/${project.slug}/` }] });
  });
  resume.presentations.forEach((talk, index) => {
    const month = parseMonth(talk.date);
    if (month === null) return;
    items.push({ id: `talk-${index}`, kind: 'presentation', title: talk.name, subtitle: talk.event, start: month, end: month, category: talk.category ?? [], tags: talk.skills, description: talk.description ?? '', links: talk.url ? [{ label: 'Resource', url: talk.url }] : [] });
  });
  return items;
}

const topOrder = ['Computer Science', 'Mathematics', 'Chemistry', 'Biology', 'Economics', 'Humanities', 'Language', 'Writing', 'Music', 'Art', 'Community', 'Other'];
const subOrder: Record<string, string[]> = {
  'Computer Science': ['Computer Vision', 'Large Language Models', 'Deep Reinforcement Learning', 'Machine Learning', 'Data Analytics', 'AI/Robotics', 'Computational Geometry', 'Algorithms', 'Cryptography', 'Computer Security', 'Computer Engineering', 'Information Theory', 'Software Engineering', 'Web Development', 'Mobile Development', 'Game Development'],
  Mathematics: ['Topology', 'Abstract Algebra', 'Real Analysis', 'Complex Analysis', 'Representation Theory', 'Quantum Information Theory', 'Probability Theory', 'Statistics', 'Linear Algebra', 'Calculus', 'Information Theory', 'Foundations'],
};

function orderIndex(order: string[], value: string) {
  const index = order.indexOf(value);
  return index === -1 ? order.length + 1 : index;
}

function groupLanes(items: TimelineItem[]): TimelineGroup[] {
  const categories = new Map<string, Map<string, TimelineItem[]>>();
  items.forEach((item) => {
    const top = item.category[0] ?? 'Other';
    const sub = item.category[1] ?? '(general)';
    if (!categories.has(top)) categories.set(top, new Map());
    const subMap = categories.get(top)!;
    if (!subMap.has(sub)) subMap.set(sub, []);
    subMap.get(sub)!.push(item);
  });
  return [...categories.entries()]
    .sort(([a], [b]) => orderIndex(topOrder, a) - orderIndex(topOrder, b) || a.localeCompare(b))
    .map(([top, subMap]) => ({
      top,
      lanes: [...subMap.entries()]
        .sort(([a], [b]) => orderIndex(subOrder[top] ?? [], a) - orderIndex(subOrder[top] ?? [], b) || a.localeCompare(b))
        .map(([sub, laneItems]) => ({ top, sub, items: laneItems })),
    }));
}

const leftGutter = 240;
const topHeader = 44;
const pixelsPerMonth = 26;
const rowHeight = 48;
const collapsedHeight = 34;

function packRows(items: TimelineItem[]) {
  items.sort((a, b) => Number(a.start) - Number(b.start));
  const ends: number[] = [];
  items.forEach((item) => {
    const start = Number(item.start);
    const end = Number(item.end);
    let row = ends.findIndex((rowEnd) => rowEnd < start);
    if (row === -1) row = ends.push(end) - 1;
    else ends[row] = end;
    item.row = row;
  });
  return Math.max(1, ends.length);
}

function buildTimeline(items: TimelineItem[], collapsed: Set<string>, toggle: (field: string) => void) {
  const now = new Date().getFullYear() * 12 + new Date().getMonth();
  const resolved = items.map((item) => ({ ...item, start: item.start === 'PRESENT' ? now : item.start, end: item.end === 'PRESENT' ? now : item.end }));
  if (resolved.length === 0) return [] as Node[];
  const minMonth = Math.min(...resolved.map((item) => Number(item.start))) - 1;
  const maxMonth = Math.max(...resolved.map((item) => Number(item.end))) + 1;
  const xOf = (month: number) => leftGutter + (month - minMonth) * pixelsPerMonth;
  const groups = groupLanes(resolved);
  let cursorY = topHeader;

  groups.forEach((group) => {
    group.collapsed = collapsed.has(group.top);
    if (group.collapsed) {
      group.flatItems = group.lanes.flatMap((lane) => lane.items).sort((a, b) => Number(a.start) - Number(b.start));
      group.yStart = cursorY;
      group.yHeight = collapsedHeight + 8;
      cursorY += group.yHeight;
    } else {
      group.yStart = cursorY;
      group.lanes.forEach((lane) => {
        lane.rowCount = packRows(lane.items);
        lane.yStart = cursorY;
        lane.yHeight = lane.rowCount * rowHeight + 8;
        cursorY += lane.yHeight;
      });
      group.yHeight = cursorY - group.yStart;
    }
  });

  const totalHeight = cursorY + 20;
  const totalWidth = xOf(maxMonth) + 20;
  const nodes: Node[] = [];
  for (let month = Math.ceil(minMonth / 12) * 12; month <= maxMonth; month += 12) {
    nodes.push({ id: `year-${month}`, type: 'stgYear', data: { year: Math.floor(month / 12), height: totalHeight }, position: { x: xOf(month) - 22, y: 4 }, draggable: false, selectable: false });
  }
  groups.forEach((group) => {
    nodes.push({ id: `field-${group.top}`, type: 'stgTopLabel', data: { title: group.top, height: group.yHeight, collapsed: group.collapsed, onToggle: () => toggle(group.top) }, position: { x: 0, y: group.yStart! }, draggable: false, selectable: false });
    if (!group.collapsed) group.lanes.forEach((lane) => nodes.push({ id: `sub-${lane.top}-${lane.sub}`, type: 'stgSubLabel', data: { title: lane.sub, height: lane.yHeight }, position: { x: 120, y: lane.yStart! }, draggable: false, selectable: false }));
    if (group.collapsed) {
      nodes.push({ id: `bg-${group.top}`, type: 'stgLaneBg', data: { width: totalWidth - leftGutter, height: group.yHeight }, position: { x: leftGutter, y: group.yStart! }, draggable: false, selectable: false });
    } else group.lanes.forEach((lane, index) => nodes.push({ id: `bg-${lane.top}-${lane.sub}`, type: 'stgLaneBg', data: { width: totalWidth - leftGutter, height: lane.yHeight, alt: index % 2 === 0 }, position: { x: leftGutter, y: lane.yStart! }, draggable: false, selectable: false }));
  });
  groups.forEach((group) => {
    const addItem = (item: TimelineItem, y: number, isCollapsed: boolean) => {
      const width = Math.max(90, (Number(item.end) - Number(item.start) + 1) * pixelsPerMonth - 8);
      nodes.push({ id: item.id, type: 'stgItem', data: { ...item, width, collapsed: isCollapsed }, position: { x: xOf(Number(item.start)) + 2, y }, draggable: false });
    };
    if (group.collapsed) group.flatItems?.forEach((item) => addItem(item, group.yStart! + 3, true));
    else group.lanes.forEach((lane) => lane.items.forEach((item) => addItem(item, lane.yStart! + (item.row ?? 0) * rowHeight + 4, false)));
  });
  return nodes;
}

function ItemNode({ data, selected }: NodeProps) {
  const item = data as TimelineItem;
  return (
    <div className={`stg-node stg-node--${item.kind}${selected ? ' stg-selected' : ''}${item.collapsed ? ' stg-node--slim' : ''}`} style={{ width: item.width }} title={item.description || item.title}>
      <div className="stg-title">{item.title}</div>
      {!item.collapsed && item.subtitle && <div className="stg-subtitle">{item.subtitle}</div>}
      {!item.collapsed && item.tags && <div className="stg-tags">{item.tags.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div>}
    </div>
  );
}

function TopLabel({ data }: NodeProps) {
  const field = data as { title: string; height: number; collapsed: boolean; onToggle: () => void };
  return <button type="button" className={`stg-toplabel nodrag nopan ${field.collapsed ? 'is-collapsed' : ''}`} style={{ height: field.height }} onClick={(event) => { event.stopPropagation(); field.onToggle(); }} aria-expanded={!field.collapsed}><span>{field.collapsed ? '▸' : '▾'}</span>{field.title}</button>;
}

function SubLabel({ data }: NodeProps) {
  const lane = data as { title: string; height: number };
  return <div className="stg-sublabel" style={{ height: lane.height }}>{lane.title}</div>;
}

function YearMarker({ data }: NodeProps) {
  const year = data as { year: number; height: number };
  return <div className="stg-year" style={{ height: year.height }}><span>{year.year}</span><i /></div>;
}

function LaneBackground({ data }: NodeProps) {
  const lane = data as { width: number; height: number; alt?: boolean };
  return <div className={`stg-lane-bg${lane.alt ? ' is-alt' : ''}`} style={{ width: lane.width, height: lane.height }} />;
}

const nodeTypes: NodeTypes = { stgItem: ItemNode, stgTopLabel: TopLabel, stgSubLabel: SubLabel, stgYear: YearMarker, stgLaneBg: LaneBackground };

export function SkillAtlasClient({ resume }: { resume: ResumeData }) {
  const items = useMemo(() => collectItems(resume), [resume]);
  const fields = useMemo(() => new Set(items.map((item) => item.category[0] ?? 'Other')), [items]);
  const [collapsed, setCollapsed] = useState(() => new Set(fields));
  const [fullscreen, setFullscreen] = useState(false);
  const toggle = useCallback((field: string) => setCollapsed((current) => {
    const next = new Set(current);
    if (next.has(field)) next.delete(field); else next.add(field);
    return next;
  }), []);
  const nodes = useMemo(() => buildTimeline(items, collapsed, toggle), [items, collapsed, toggle]);

  useEffect(() => {
    document.body.classList.toggle('stg-fullscreen-open', fullscreen);
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setFullscreen(false); };
    document.addEventListener('keydown', close);
    return () => { document.body.classList.remove('stg-fullscreen-open'); document.removeEventListener('keydown', close); };
  }, [fullscreen]);

  return (
    <section className={`stg-wrapper${fullscreen ? ' stg-fullscreen' : ''}`}>
      <div className="stg-root" role="region" aria-label="Skill tree timeline">
        <ReactFlowProvider>
          <ReactFlow nodes={nodes} edges={[]} nodeTypes={nodeTypes} fitView fitViewOptions={{ padding: 0.1 }} minZoom={0.2} maxZoom={2} nodesDraggable={false} nodesConnectable={false} panOnDrag zoomOnScroll zoomOnPinch proOptions={{ hideAttribution: true }} onNodeClick={(_, node) => {
            if (node.type !== 'stgItem') return;
            const item = node.data as TimelineItem;
            const url = item.links[0]?.url;
            if (!url) return;
            if (url.startsWith('/')) window.location.href = withBasePath(url); else window.open(url, '_blank', 'noopener,noreferrer');
          }}>
            <Background gap={24} size={1} />
            <Controls position="bottom-right" showInteractive={false} />
            <MiniMap pannable zoomable nodeColor={(node) => ({ education: '#2563eb', work: '#16a34a', course: '#0891b2', 'course-grad': '#d97706', portfolio: '#db2777', presentation: '#9333ea' }[(node.data as TimelineItem).kind] ?? '#94a3b8')} nodeStrokeWidth={0} />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
      <button type="button" className="stg-fs-btn" onClick={() => setFullscreen((value) => !value)} aria-label="Toggle skill tree fullscreen">{fullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}{fullscreen ? 'Quit fullscreen' : 'Fullscreen'}</button>
      <p className="stg-hint">Drag to pan · scroll to zoom · click a discipline label to expand its sub-branches · click a node to open its project or resource. Vertical axis = topic; horizontal axis = time.</p>
    </section>
  );
}

export function CourseArchiveClient({ semesters }: { semesters: SkillSemester[] }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(semesters[0]?.semesters ?? '');
  useEffect(() => {
    const target = decodeURIComponent(window.location.hash.slice(1));
    if (!target.startsWith('course-')) return;
    const semester = semesters.find((item) => item.courses.some((course) => courseAnchor(item.semesters, course.name) === target));
    if (!semester) return;
    const timer = window.setTimeout(() => {
      setOpen(semester.semesters);
      window.requestAnimationFrame(() => window.requestAnimationFrame(() => document.getElementById(target)?.scrollIntoView({ block: 'center' })));
    }, 0);
    return () => window.clearTimeout(timer);
  }, [semesters]);
  const needle = query.trim().toLowerCase();
  const filtered = semesters.map((semester) => ({ ...semester, courses: semester.courses.filter((course) => !needle || [course.name, course.level, course.description, course.tags?.join(' ')].join(' ').toLowerCase().includes(needle)) })).filter((semester) => semester.courses.length > 0);
  return (
    <section className="course-archive">
      <label className="course-search"><Search size={17} /><span className="sr-only">Search courses</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a course or topic…" /></label>
      <div className="semester-list">
        {filtered.map((semester) => {
          const expanded = open === semester.semesters || Boolean(query);
          return <section key={semester.semesters} className="semester-group"><button type="button" aria-expanded={expanded} onClick={() => setOpen(expanded ? '' : semester.semesters)}><span><small>{semester.courses.length} courses</small><strong>{semester.semesters}</strong></span><ChevronDown size={19} /></button>{expanded && <div className="course-grid">{semester.courses.map((course) => <article id={courseAnchor(semester.semesters, course.name)} key={course.name}><BookOpen size={17} /><div><h3>{course.name}</h3><p>{course.level}</p>{course.description && <small>{course.description}</small>}<div className="tag-row compact">{course.tags?.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}</div></div></article>)}</div>}</section>;
        })}
      </div>
    </section>
  );
}
