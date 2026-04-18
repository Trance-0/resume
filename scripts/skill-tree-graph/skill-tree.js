import * as React from 'react';
import { createRoot } from 'react-dom/client';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
} from '@xyflow/react';

const h = React.createElement;

const MONTHS = {
  jan: 0, january: 0,
  feb: 1, february: 1,
  mar: 2, march: 2,
  apr: 3, april: 3,
  may: 4,
  jun: 5, june: 5,
  jul: 6, july: 6,
  aug: 7, august: 7,
  sep: 8, sept: 8, september: 8,
  oct: 9, october: 9,
  nov: 10, november: 10,
  dec: 11, december: 11,
};

const nowMonthIndex = () => {
  const d = new Date();
  return d.getFullYear() * 12 + d.getMonth();
};

const parseMonth = (raw) => {
  if (raw === null || raw === undefined) return null;
  const s = String(raw).trim();
  if (!s) return null;
  if (/^present$/i.test(s) || /^current$/i.test(s) || /^now$/i.test(s)) return 'PRESENT';
  let m = /^(\d{4})[-/](\d{1,2})(?:[-/]\d{1,2})?$/.exec(s);
  if (m) return Number(m[1]) * 12 + Math.max(0, Math.min(11, Number(m[2]) - 1));
  m = /^(\d{4})$/.exec(s);
  if (m) return Number(m[1]) * 12;
  m = /^([A-Za-z]+)\.?\s+(\d{4})$/.exec(s);
  if (m) {
    const mi = MONTHS[m[1].toLowerCase()];
    if (mi !== undefined) return Number(m[2]) * 12 + mi;
  }
  return null;
};

const semesterRange = (label) => {
  if (!label) return null;
  const y = /(\d{4})/.exec(label);
  if (!y) {
    if (/high\s+school/i.test(label)) {
      const base = 2020 * 12;
      return [base, 2022 * 12 + 4];
    }
    return null;
  }
  const year = Number(y[1]);
  if (/spring/i.test(label)) return [year * 12 + 0, year * 12 + 4];
  if (/summer/i.test(label)) return [year * 12 + 4, year * 12 + 7];
  if (/fall/i.test(label)) return [year * 12 + 7, year * 12 + 11];
  if (/winter/i.test(label)) return [year * 12 + 11, (year + 1) * 12 + 0];
  return [year * 12, year * 12 + 11];
};

const parsePortfolioRange = (str) => {
  if (!str) return null;
  const parts = String(str).split(/\s+[-–]\s+/);
  if (parts.length === 2) {
    const a = parseMonth(parts[0]);
    const b = parseMonth(parts[1]);
    if (a !== null && b !== null) return [a, b];
  }
  const single = parseMonth(str);
  if (single !== null) return [single, single];
  return null;
};

function collectItems(cv) {
  const items = [];

  (cv.education || []).forEach((e, i) => {
    const a = parseMonth(e.startDate);
    const b = parseMonth(e.endDate);
    if (a === null || b === null) return;
    items.push({
      id: `edu-${i}`,
      kind: 'education',
      title: e.area ? `${e.studyType || 'Degree'} in ${e.area}` : (e.studyType || 'Education'),
      subtitle: e.institution || '',
      start: a,
      end: b,
      category: e.category || [],
      description: (e.focus || []).join(', '),
      links: [],
    });
  });

  (cv.work || []).forEach((w, i) => {
    const a = parseMonth(w.startDate);
    const b = parseMonth(w.endDate);
    if (a === null || b === null) return;
    items.push({
      id: `work-${i}`,
      kind: 'work',
      title: w.position || 'Position',
      subtitle: w.company || '',
      start: a,
      end: b,
      category: w.category || [],
      description: w.summary || '',
      links: [],
    });
  });

  (cv.skills || []).forEach((sem, si) => {
    const range = semesterRange(sem.semesters);
    if (!range) return;
    (sem.courses || []).forEach((c, ci) => {
      const level = (c.level || '').toLowerCase();
      const kind = level.includes('graduate') && !level.includes('undergraduate')
        ? 'course-grad'
        : level.includes('research')
        ? 'course-grad'
        : 'course';
      items.push({
        id: `course-${si}-${ci}`,
        kind,
        title: c.name || 'Course',
        subtitle: c.level || '',
        start: range[0],
        end: range[1],
        category: c.category || [],
        tags: c.tags || [],
        description: c.description || '',
        links: (c.textbooks || []).map((t) => ({ label: t.name, url: t.url })),
      });
    });
  });

  (cv.portfolio || []).forEach((p, i) => {
    const range = parsePortfolioRange(p.date || '');
    if (!range) return;
    items.push({
      id: `proj-${i}`,
      kind: 'portfolio',
      title: p.name || 'Project',
      subtitle: p.category || '',
      start: range[0],
      end: range[1],
      category: p.topicCategory || [],
      tags: p.skills || [],
      description: (p['description-keys'] || []).join(' '),
      links: (p.links || []).map((l) => ({ label: l.label, url: l.url })),
    });
  });

  (cv.presentations || []).forEach((pr, i) => {
    const m = parseMonth(pr.date);
    if (m === null) return;
    items.push({
      id: `pres-${i}`,
      kind: 'presentation',
      title: pr.name || 'Presentation',
      subtitle: pr.event || '',
      start: m,
      end: m,
      category: pr.category || [],
      tags: pr.skills || [],
      description: pr.description || '',
      links: pr.url ? [{ label: 'Slides', url: pr.url }] : [],
    });
  });

  return items;
}

const TOP_ORDER = [
  'Computer Science',
  'Mathematics',
  'Chemistry',
  'Biology',
  'Economics',
  'Humanities',
  'Language',
  'Writing',
  'Music',
  'Art',
  'Community',
  'Other',
];

const SUB_ORDER = {
  'Computer Science': [
    'Computer Vision',
    'Large Language Models',
    'Deep Reinforcement Learning',
    'Machine Learning',
    'Data Analytics',
    'AI/Robotics',
    'Computational Geometry',
    'Algorithms',
    'Cryptography',
    'Computer Security',
    'Computer Engineering',
    'Information Theory',
    'Software Engineering',
    'Web Development',
    'Mobile Development',
    'Game Development',
  ],
  Mathematics: [
    'Topology',
    'Abstract Algebra',
    'Real Analysis',
    'Complex Analysis',
    'Representation Theory',
    'Quantum Information Theory',
    'Probability Theory',
    'Statistics',
    'Linear Algebra',
    'Calculus',
    'Information Theory',
    'Foundations',
  ],
};

function groupLanes(items) {
  const byCat = new Map();
  items.forEach((it) => {
    const top = (it.category && it.category[0]) || 'Other';
    const sub = (it.category && it.category[1]) || '(general)';
    if (!byCat.has(top)) byCat.set(top, new Map());
    const subMap = byCat.get(top);
    if (!subMap.has(sub)) subMap.set(sub, []);
    subMap.get(sub).push(it);
  });

  const orderIdx = (list, name) => {
    const i = list.indexOf(name);
    return i === -1 ? list.length + 1 : i;
  };

  const tops = Array.from(byCat.keys()).sort(
    (a, b) => orderIdx(TOP_ORDER, a) - orderIdx(TOP_ORDER, b) || a.localeCompare(b),
  );

  const groups = [];
  tops.forEach((top) => {
    const subMap = byCat.get(top);
    const subs = Array.from(subMap.keys());
    const preferred = SUB_ORDER[top] || [];
    subs.sort(
      (a, b) => orderIdx(preferred, a) - orderIdx(preferred, b) || a.localeCompare(b),
    );
    const lanes = subs.map((sub) => ({ top, sub, items: subMap.get(sub) }));
    groups.push({ top, lanes });
  });
  return groups;
}

const LEFT_GUTTER = 240;
const TOP_HEADER = 44;
const PX_PER_MONTH = 26;
const ROW_HEIGHT = 48;
const COLLAPSED_ROW_HEIGHT = 34;
const LANE_PAD_BOTTOM = 8;
const MIN_NODE_WIDTH = 90;

function packRows(items) {
  items.sort((a, b) => a.start - b.start);
  const rowEnds = [];
  items.forEach((it) => {
    let placed = -1;
    for (let r = 0; r < rowEnds.length; r++) {
      if (rowEnds[r] < it.start) {
        rowEnds[r] = it.end;
        placed = r;
        break;
      }
    }
    if (placed === -1) {
      rowEnds.push(it.end);
      placed = rowEnds.length - 1;
    }
    it._row = placed;
  });
  return Math.max(1, rowEnds.length);
}

function layoutTimeline(items, collapsedTops, onToggleTop) {
  const now = nowMonthIndex();
  const resolved = items
    .map((it) => ({
      ...it,
      start: it.start === 'PRESENT' ? now : it.start,
      end: it.end === 'PRESENT' ? now : it.end,
    }))
    .filter((it) => typeof it.start === 'number' && typeof it.end === 'number');

  if (resolved.length === 0) {
    return { nodes: [], totalWidth: 0, totalHeight: 0 };
  }

  const minMonth = Math.min(...resolved.map((it) => it.start)) - 1;
  const maxMonth = Math.max(...resolved.map((it) => it.end)) + 1;
  const xOf = (m) => LEFT_GUTTER + (m - minMonth) * PX_PER_MONTH;

  const groups = groupLanes(resolved);

  groups.forEach((g) => {
    g.collapsed = collapsedTops.has(g.top);
    if (g.collapsed) {
      // Treat the whole discipline as a single lane with one row.
      const allItems = g.lanes.flatMap((l) => l.items);
      allItems.sort((a, b) => a.start - b.start);
      allItems.forEach((it) => {
        it._row = 0;
      });
      g.flatItems = allItems;
    } else {
      g.lanes.forEach((lane) => {
        lane.rowCount = packRows(lane.items);
      });
    }
  });

  let cursorY = TOP_HEADER;
  groups.forEach((g) => {
    g.yStart = cursorY;
    if (g.collapsed) {
      g.yHeight = COLLAPSED_ROW_HEIGHT + LANE_PAD_BOTTOM;
      cursorY += g.yHeight;
    } else {
      let sub = cursorY;
      g.lanes.forEach((lane) => {
        lane.yStart = sub;
        lane.yHeight = lane.rowCount * ROW_HEIGHT + LANE_PAD_BOTTOM;
        sub += lane.yHeight;
      });
      g.yHeight = sub - cursorY;
      cursorY = sub;
    }
  });

  const totalHeight = cursorY + 20;
  const totalWidth = xOf(maxMonth) + 20;

  const nodes = [];

  for (let m = Math.ceil(minMonth / 12) * 12; m <= maxMonth; m += 12) {
    const year = Math.floor(m / 12);
    nodes.push({
      id: `year-${year}`,
      type: 'stgYear',
      data: { year, height: totalHeight },
      position: { x: xOf(m) - 22, y: 4 },
      draggable: false,
      selectable: false,
    });
  }

  groups.forEach((g) => {
    nodes.push({
      id: `toplabel-${g.top}`,
      type: 'stgTopLabel',
      data: {
        title: g.top,
        height: g.yHeight,
        collapsed: g.collapsed,
        onToggle: () => onToggleTop(g.top),
      },
      position: { x: 0, y: g.yStart },
      draggable: false,
      selectable: false,
    });

    if (!g.collapsed) {
      g.lanes.forEach((lane) => {
        nodes.push({
          id: `sublabel-${lane.top}-${lane.sub}`,
          type: 'stgSubLabel',
          data: { title: lane.sub, height: lane.yHeight },
          position: { x: 120, y: lane.yStart },
          draggable: false,
          selectable: false,
        });
      });
    }

    // Lane backgrounds
    if (g.collapsed) {
      nodes.push({
        id: `topBg-${g.top}`,
        type: 'stgLaneBg',
        data: {
          width: totalWidth - LEFT_GUTTER,
          height: g.yHeight,
          alt: false,
        },
        position: { x: LEFT_GUTTER, y: g.yStart },
        draggable: false,
        selectable: false,
      });
    } else {
      g.lanes.forEach((lane, li) => {
        nodes.push({
          id: `laneBg-${lane.top}-${lane.sub}`,
          type: 'stgLaneBg',
          data: {
            width: totalWidth - LEFT_GUTTER,
            height: lane.yHeight,
            alt: li % 2 === 0,
          },
          position: { x: LEFT_GUTTER, y: lane.yStart },
          draggable: false,
          selectable: false,
        });
      });
    }
  });

  groups.forEach((g) => {
    if (g.collapsed) {
      g.flatItems.forEach((it) => {
        const width = Math.max(
          MIN_NODE_WIDTH,
          (it.end - it.start + 1) * PX_PER_MONTH - 8,
        );
        nodes.push({
          id: it.id,
          type: 'stgItem',
          data: { ...it, width, collapsed: true },
          position: {
            x: xOf(it.start) + 2,
            y: g.yStart + 3,
          },
          draggable: false,
          selectable: true,
        });
      });
    } else {
      g.lanes.forEach((lane) => {
        lane.items.forEach((it) => {
          const width = Math.max(
            MIN_NODE_WIDTH,
            (it.end - it.start + 1) * PX_PER_MONTH - 8,
          );
          nodes.push({
            id: it.id,
            type: 'stgItem',
            data: { ...it, width, collapsed: false },
            position: {
              x: xOf(it.start) + 2,
              y: lane.yStart + it._row * ROW_HEIGHT + 4,
            },
            draggable: false,
            selectable: true,
          });
        });
      });
    }
  });

  return { nodes, totalWidth, totalHeight };
}

function ItemNode({ data, selected }) {
  const cls = ['stg-node', `stg-node--${data.kind || 'default'}`];
  if (selected) cls.push('stg-selected');
  if (data.collapsed) cls.push('stg-node--slim');
  return h(
    'div',
    {
      className: cls.join(' '),
      style: { width: data.width, maxWidth: data.width },
      title: data.description || data.title || '',
    },
    h('div', { className: 'stg-title' }, data.title || ''),
    !data.collapsed && data.subtitle
      ? h('div', { className: 'stg-subtitle' }, data.subtitle)
      : null,
    !data.collapsed && data.tags && data.tags.length
      ? h(
          'div',
          { className: 'stg-tags' },
          data.tags
            .slice(0, 4)
            .map((t, i) => h('span', { key: i, className: 'stg-tag-chip' }, t)),
        )
      : null,
    !data.collapsed && data.links && data.links.length
      ? h(
          'div',
          { className: 'stg-links' },
          data.links
            .slice(0, 2)
            .map((l, i) =>
              h(
                'a',
                {
                  key: i,
                  href: l.url,
                  target: '_blank',
                  rel: 'noopener noreferrer',
                  onClick: (e) => e.stopPropagation(),
                },
                l.label || 'link',
              ),
            ),
        )
      : null,
  );
}

function TopLabel({ data }) {
  return h(
    'div',
    {
      className: `stg-toplabel ${data.collapsed ? 'stg-toplabel--collapsed' : 'stg-toplabel--open'}`,
      style: { height: data.height },
      onClick: (e) => {
        e.stopPropagation();
        if (data.onToggle) data.onToggle();
      },
      title: data.collapsed ? 'Click to expand' : 'Click to collapse',
    },
    h('span', { className: 'stg-toplabel__caret' }, data.collapsed ? '▸' : '▾'),
    h('span', { className: 'stg-toplabel__text' }, data.title),
  );
}

function SubLabel({ data }) {
  return h(
    'div',
    { className: 'stg-sublabel', style: { height: data.height } },
    data.title,
  );
}

function YearMarker({ data }) {
  return h(
    'div',
    { className: 'stg-year', style: { height: data.height } },
    h('div', { className: 'stg-year__label' }, data.year),
    h('div', { className: 'stg-year__line' }),
  );
}

function LaneBg({ data }) {
  return h('div', {
    className: `stg-lane-bg ${data.alt ? 'stg-lane-bg--alt' : ''}`,
    style: { width: data.width, height: data.height },
  });
}

const nodeTypes = {
  stgItem: ItemNode,
  stgTopLabel: TopLabel,
  stgSubLabel: SubLabel,
  stgYear: YearMarker,
  stgLaneBg: LaneBg,
};

function Widget({ cv }) {
  const items = React.useMemo(() => collectItems(cv), [cv]);

  const allTops = React.useMemo(() => {
    const s = new Set();
    items.forEach((it) => s.add((it.category && it.category[0]) || 'Other'));
    return s;
  }, [items]);

  const [collapsedTops, setCollapsedTops] = React.useState(() => new Set(allTops));

  React.useEffect(() => {
    // Ensure any newly-discovered top-level defaults to collapsed.
    setCollapsedTops((prev) => {
      let changed = false;
      const next = new Set(prev);
      allTops.forEach((t) => {
        if (!next.has(t)) {
          next.add(t);
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [allTops]);

  const toggleTop = React.useCallback((top) => {
    setCollapsedTops((prev) => {
      const next = new Set(prev);
      if (next.has(top)) next.delete(top);
      else next.add(top);
      return next;
    });
  }, []);

  const layout = React.useMemo(
    () => layoutTimeline(items, collapsedTops, toggleTop),
    [items, collapsedTops, toggleTop],
  );

  const onNodeClick = React.useCallback((_e, node) => {
    if (node.type !== 'stgItem') return;
    const link = (node.data && node.data.links && node.data.links[0]) || null;
    if (link && link.url) window.open(link.url, '_blank', 'noopener');
  }, []);

  return h(
    ReactFlow,
    {
      nodes: layout.nodes,
      edges: [],
      onNodeClick,
      nodeTypes,
      fitView: true,
      fitViewOptions: { padding: 0.1 },
      minZoom: 0.2,
      maxZoom: 2,
      proOptions: { hideAttribution: true },
      nodesDraggable: false,
      nodesConnectable: false,
      elementsSelectable: true,
      panOnDrag: true,
      zoomOnScroll: true,
      zoomOnPinch: true,
    },
    h(Background, { gap: 24, color: '#eef2f7' }),
    h(Controls, { position: 'bottom-right', showInteractive: false }),
    h(MiniMap, {
      pannable: true,
      zoomable: true,
      nodeColor: (n) => {
        const k = n.data && n.data.kind;
        return (
          {
            education: '#2563eb',
            work: '#16a34a',
            course: '#0891b2',
            'course-grad': '#d97706',
            portfolio: '#db2777',
            presentation: '#9333ea',
          }[k] || '#cbd5e1'
        );
      },
      nodeStrokeWidth: 0,
    }),
  );
}

function mount() {
  const root = document.getElementById('stg-root');
  if (!root) return;
  let cv = {};
  try {
    const el = document.getElementById('stg-cv-data');
    cv = el ? JSON.parse(el.textContent || '{}') : {};
  } catch (err) {
    root.innerHTML = '';
    const errBox = document.createElement('div');
    errBox.className = 'stg-error';
    errBox.textContent = `Failed to parse cv.json: ${err && err.message ? err.message : err}`;
    root.appendChild(errBox);
    return;
  }
  root.innerHTML = '';
  const r = createRoot(root);
  r.render(h(ReactFlowProvider, null, h(Widget, { cv })));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
