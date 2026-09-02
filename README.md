# Resume site

A fully static resume and portfolio built with Next.js, Fumadocs MDX, Motion, and React Flow. The production export contains only HTML, CSS, JavaScript, and media—there is no server, database, or API dependency.

## Edit content

Every routine human-editable file lives under [`content/`](./content/):

- `content/site/index.mdx` — identity, navigation, links, homepage copy, and pathways
- `content/resume/` — one organized MDX collection for each resume section
- `content/pages/` — page prose and placement of interactive widgets
- `content/README.md` — the complete editing guide

The application validates MDX frontmatter during every build and derives all lists, filters, timelines, counts, and diagrams from those collections.

## Develop

Requires Node.js 22 or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verify and export

```bash
npm run typecheck
npm run lint
npm run build
```

`npm run build` writes the deployable static site to `out/`. Any static host can serve that directory. Cloudflare Pages is configured through `wrangler.toml`.

## Architecture

- Next.js App Router provides routing, metadata, and static generation.
- Fumadocs compiles both site pages and resume records from MDX.
- Zod schemas in `source.config.ts` validate every editable record.
- Small React widgets provide search, tabs, filtering, animation, media embeds, and the skills atlas.
- All routes are statically exported with `output: 'export'`.

## Deployment-version alert

The Pages workflow injects `NEXT_PUBLIC_DEPLOYED_SHA=${{ github.sha }}` during the static build. The header compares that immutable deployed SHA with GitHub's current `main` commit in the browser. A deployment link appears only while they differ; API/network failures fail closed, and the alert disappears automatically when the new Pages artifact is serving. Local builds omit the SHA and never show the alert.
