import * as React from 'react';
import { createRoot } from 'react-dom/client';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  MarkerType,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import dagre from '@dagrejs/dagre';

const h = React.createElement;

const slug = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const attr = (obj, key, fallback) =>
  obj && obj[key] !== undefined && obj[key] !== null ? obj[key] : fallback;

const readGraph = (entry) => (entry && typeof entry === 'object' ? entry.graph || {} : {});
const weightOf = (entry) => {
  const w = Number(attr(readGraph(entry), 'weight', 1));
  return Number.isFinite(w) && w > 0 ? w : 1;
};
const isHidden = (entry) => Boolean(attr(readGraph(entry), 'hidden', false));

const semesterOrder = (label) => {
  const m = /(\d{4})/.exec(label || '');
  const year = m ? Number(m[1]) : 0;
  const season = /spring/i.test(label) ? 0.25
    : /summer/i.test(label) ? 0.5
    : /fall/i.test(label) ? 0.75
    : /winter/i.test(label) ? 1.0
    : 0;
  return year + season;
};

const dateOrder = (d) => {
  if (!d) return 0;
  const m = /(\d{4})(?:-(\d{1,2}))?/.exec(String(d));
  if (!m) return 0;
  return Number(m[1]) + (m[2] ? Number(m[2]) / 12 : 0);
};

function buildGraph(cv) {
  const nodes = [];
  const edges = [];
  const courseNodeForTag = new Map();

  const pushEdge = (source, target, opts = {}) => {
    const id = `${source}~${target}~${edges.length}`;
    edges.push({
      id,
      source,
      target,
      type: opts.type || 'smoothstep',
      animated: !!opts.animated,
      style: {
        stroke: opts.stroke || '#64748b',
        strokeWidth: opts.strokeWidth || 1.5,
        ...(opts.dashed ? { strokeDasharray: '5 4' } : {}),
      },
      markerEnd: opts.noArrow
        ? undefined
        : { type: MarkerType.ArrowClosed, color: opts.stroke || '#64748b' },
      label: opts.label,
      labelStyle: opts.label ? { fontSize: 10, fill: '#475569' } : undefined,
      labelBgStyle: opts.label ? { fill: '#ffffff' } : undefined,
      labelBgPadding: opts.label ? [4, 2] : undefined,
      labelBgBorderRadius: 4,
    });
  };

  const basics = cv.basics || {};
  nodes.push({
    id: 'me',
    type: 'stgNode',
    data: {
      kind: 'me',
      title: basics.name || 'Me',
      subtitle: basics.summary || '',
      weight: 3,
    },
    position: { x: 0, y: 0 },
  });

  const hubs = [
    { id: 'hub-courses', title: 'Courses', stroke: '#6366f1' },
    { id: 'hub-projects', title: 'Projects', stroke: '#db2777' },
    { id: 'hub-work', title: 'Work & Teaching', stroke: '#16a34a' },
    { id: 'hub-presentations', title: 'Presentations', stroke: '#9333ea' },
  ];
  hubs.forEach((hub) => {
    nodes.push({
      id: hub.id,
      type: 'stgNode',
      data: { kind: 'hub', title: hub.title, weight: 2 },
      position: { x: 0, y: 0 },
    });
    pushEdge('me', hub.id, { stroke: hub.stroke, strokeWidth: 2 });
  });

  const skills = Array.isArray(cv.skills) ? cv.skills : [];
  const sortedSem = skills
    .map((s, i) => ({ s, i, order: semesterOrder(s.semesters || '') }))
    .filter((e) => !isHidden(e.s))
    .sort((a, b) => b.order - a.order || a.i - b.i);

  sortedSem.forEach(({ s, i }) => {
    const semId = `sem-${i}`;
    nodes.push({
      id: semId,
      type: 'stgNode',
      data: {
        kind: 'semester',
        title: s.semesters || 'Semester',
        weight: weightOf(s),
      },
      position: { x: 0, y: 0 },
    });
    pushEdge('hub-courses', semId, { stroke: '#6366f1' });

    (s.courses || []).forEach((c, ci) => {
      if (isHidden(c)) return;
      const courseId = `course-${i}-${ci}`;
      const level = (c.level || '').toLowerCase();
      const kindSub = level.includes('graduate') && !level.includes('undergraduate')
        ? 'course-grad'
        : 'course';
      nodes.push({
        id: courseId,
        type: 'stgNode',
        data: {
          kind: kindSub,
          title: c.name || 'Course',
          subtitle: c.level || '',
          tags: c.tags || [],
          description: c.description || '',
          links: (c.textbooks || []).map((t) => ({ label: t.name, url: t.url })),
          weight: weightOf(c),
        },
        position: { x: 0, y: 0 },
      });
      pushEdge(semId, courseId, { stroke: '#0891b2' });

      (c.tags || []).forEach((t) => {
        const ts = slug(t);
        if (!courseNodeForTag.has(ts)) {
          courseNodeForTag.set(ts, { id: courseId, tag: t, order: semesterOrder(s.semesters) });
        }
      });

      (attr(readGraph(c), 'prerequisites', []) || []).forEach((prereq) => {
        const ts = slug(prereq);
        const ref = courseNodeForTag.get(ts);
        if (ref && ref.id !== courseId) {
          pushEdge(courseId, ref.id, {
            stroke: '#a3a3a3',
            dashed: true,
            label: prereq,
            type: 'bezier',
          });
        }
      });
    });
  });

  const portfolio = Array.isArray(cv.portfolio) ? cv.portfolio : [];
  portfolio
    .map((p, i) => ({ p, i, order: dateOrder(p.date || '') }))
    .filter((e) => !isHidden(e.p))
    .sort((a, b) => b.order - a.order || a.i - b.i)
    .forEach(({ p, i }) => {
      const pid = `proj-${i}`;
      nodes.push({
        id: pid,
        type: 'stgNode',
        data: {
          kind: 'portfolio',
          title: p.name || 'Project',
          subtitle: p.category || '',
          date: p.date || '',
          tags: p.skills || [],
          description: (p['description-keys'] || []).join(' '),
          links: (p.links || []).map((l) => ({ label: l.label, url: l.url })),
          weight: weightOf(p),
        },
        position: { x: 0, y: 0 },
      });
      pushEdge('hub-projects', pid, { stroke: '#db2777' });

      (p.skills || []).forEach((sk) => {
        const ref = courseNodeForTag.get(slug(sk));
        if (ref) {
          pushEdge(pid, ref.id, {
            stroke: '#94a3b8',
            dashed: true,
            label: sk,
            type: 'bezier',
            strokeWidth: 1,
            noArrow: true,
          });
        }
      });
    });

  const work = Array.isArray(cv.work) ? cv.work : [];
  work
    .map((w, i) => ({ w, i, order: dateOrder(w.startDate || '') }))
    .filter((e) => !isHidden(e.w))
    .sort((a, b) => b.order - a.order || a.i - b.i)
    .forEach(({ w, i }) => {
      const wid = `work-${i}`;
      nodes.push({
        id: wid,
        type: 'stgNode',
        data: {
          kind: 'work',
          title: w.position || 'Position',
          subtitle: w.company || '',
          date: [w.startDate, w.endDate].filter(Boolean).join(' – '),
          description: w.summary || '',
          weight: weightOf(w),
        },
        position: { x: 0, y: 0 },
      });
      pushEdge('hub-work', wid, { stroke: '#16a34a' });
    });

  const pres = Array.isArray(cv.presentations) ? cv.presentations : [];
  pres
    .map((pr, i) => ({ pr, i, order: dateOrder(pr.date || '') }))
    .filter((e) => !isHidden(e.pr))
    .sort((a, b) => b.order - a.order || a.i - b.i)
    .forEach(({ pr, i }) => {
      const prid = `pres-${i}`;
      nodes.push({
        id: prid,
        type: 'stgNode',
        data: {
          kind: 'presentation',
          title: pr.name || 'Presentation',
          subtitle: pr.event || '',
          date: pr.date || '',
          tags: pr.skills || [],
          description: pr.description || '',
          links: pr.url ? [{ label: 'Slides', url: pr.url }] : [],
          weight: weightOf(pr),
        },
        position: { x: 0, y: 0 },
      });
      pushEdge('hub-presentations', prid, { stroke: '#9333ea' });

      (pr.skills || []).forEach((sk) => {
        const ref = courseNodeForTag.get(slug(sk));
        if (ref) {
          pushEdge(prid, ref.id, {
            stroke: '#cbd5e1',
            dashed: true,
            type: 'bezier',
            strokeWidth: 1,
            noArrow: true,
          });
        }
      });
    });

  return { nodes, edges };
}

function layoutLR(nodes, edges) {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({
    rankdir: 'LR',
    align: 'UL',
    ranker: 'longest-path',
    nodesep: 24,
    ranksep: 110,
    edgesep: 10,
    marginx: 24,
    marginy: 24,
  });

  const baseW = 210;
  const baseH = 72;
  nodes.forEach((n) => {
    const w = n.data.weight || 1;
    g.setNode(n.id, {
      width: baseW + Math.min(80, (w - 1) * 24),
      height: baseH + Math.min(40, (w - 1) * 12),
    });
  });
  edges.forEach((e) => {
    if (!e.style || e.style.strokeDasharray) return;
    g.setEdge(e.source, e.target);
  });
  dagre.layout(g);

  return nodes.map((n) => {
    const p = g.node(n.id);
    return {
      ...n,
      position: { x: Math.round(p.x - p.width / 2), y: Math.round(p.y - p.height / 2) },
      draggable: false,
      selectable: true,
      connectable: false,
    };
  });
}

function StgNode({ data, selected }) {
  const cls = ['stg-node', `stg-node--${data.kind || 'default'}`];
  if (selected) cls.push('stg-selected');
  return h(
    'div',
    { className: cls.join(' '), title: data.description || '' },
    h(Handle, {
      type: 'target',
      position: Position.Left,
      style: { background: '#94a3b8', width: 8, height: 8 },
    }),
    h('div', { className: 'stg-title' }, data.title || ''),
    data.subtitle ? h('div', { className: 'stg-subtitle' }, data.subtitle) : null,
    data.date ? h('div', { className: 'stg-subtitle' }, data.date) : null,
    data.tags && data.tags.length
      ? h(
          'div',
          { className: 'stg-tags' },
          data.tags.slice(0, 6).map((t, i) => h('span', { key: i, className: 'stg-tag-chip' }, t)),
          data.tags.length > 6
            ? h('span', { className: 'stg-tag-chip' }, `+${data.tags.length - 6}`)
            : null,
        )
      : null,
    data.links && data.links.length
      ? h(
          'div',
          { className: 'stg-links' },
          data.links.slice(0, 3).map((l, i) =>
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
    h(Handle, {
      type: 'source',
      position: Position.Right,
      style: { background: '#94a3b8', width: 8, height: 8 },
    }),
  );
}

const nodeTypes = { stgNode: StgNode };

function Widget({ cv }) {
  const built = React.useMemo(() => buildGraph(cv), [cv]);
  const laidOut = React.useMemo(() => layoutLR(built.nodes, built.edges), [built]);
  const [nodes, , onNodesChange] = useNodesState(laidOut);
  const [edges, , onEdgesChange] = useEdgesState(built.edges);

  const onNodeClick = React.useCallback((_e, node) => {
    const link = (node.data && node.data.links && node.data.links[0]) || null;
    if (link && link.url) window.open(link.url, '_blank', 'noopener');
  }, []);

  return h(
    ReactFlow,
    {
      nodes,
      edges,
      onNodesChange,
      onEdgesChange,
      onNodeClick,
      nodeTypes,
      fitView: true,
      minZoom: 0.2,
      maxZoom: 2,
      proOptions: { hideAttribution: true },
      defaultEdgeOptions: { type: 'smoothstep' },
      nodesDraggable: false,
      nodesConnectable: false,
      elementsSelectable: true,
      panOnDrag: true,
      zoomOnScroll: true,
      zoomOnPinch: true,
    },
    h(Background, { gap: 18, color: '#e5e7eb' }),
    h(Controls, { position: 'bottom-right', showInteractive: false }),
    h(MiniMap, {
      pannable: true,
      zoomable: true,
      nodeColor: (n) => {
        const k = n.data && n.data.kind;
        return (
          {
            me: '#1d4ed8',
            hub: '#0f172a',
            semester: '#6366f1',
            course: '#0891b2',
            'course-grad': '#d97706',
            portfolio: '#db2777',
            work: '#16a34a',
            presentation: '#9333ea',
          }[k] || '#94a3b8'
        );
      },
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
