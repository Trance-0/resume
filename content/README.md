# Editing the site

All routine content editing happens in this directory. Every content source is MDX, so a record is edited like a small Markdown document with structured frontmatter between the opening `---` lines.

## Directory map

- `site/index.mdx` — identity, navigation, profile links, homepage hero, and inquiry tabs
- `pathways/index.mdx` — explicitly selected, ordered projects and courses for each homepage pathway
- `pages/*.mdx` — page titles, descriptions, prose, headings, and widget placement
- `resume/profile/index.mdx` — contact details, profile links, and languages
- `resume/education/*.mdx` — one degree per file
- `resume/experience/*.mdx` — one position per file
- `resume/projects/*.mdx` — one project per file; frontmatter powers cards and filters, while the Markdown body is its detail page
- `resume/courses/*.mdx` — one semester per file, with its courses grouped together
- `resume/talks/*.mdx` — one talk per file
- `resume/questions/*.mdx` — one question and answer per file
- `resume/qa-settings/index.mdx` — Q&A introduction and update date

## Adding a record

Copy a neighboring MDX file in the appropriate directory, give it the next numeric filename prefix, and update its frontmatter. The `order` field controls display order independently of the filename. A production build reports a clear validation error if a required field is missing or malformed.

Project URLs are generated from their `title`. Portfolio cards automatically link to the Markdown body in the matching project file, so no route code is needed when adding a project.

Pathway entries are never inferred from broad categories. Edit `pathways/index.mdx` and add either a project `slug` or an exact course `semester` and `course` name to control the unified lists.

Page files use ordinary Markdown. Existing component tags such as `<PortfolioExplorer />` and `<SkillAtlas />` insert interactive widgets; move or remove a tag only when you want to change the page composition.

## Media

Local media belongs in `public/media/` or `public/files/` and is referenced with a root-relative URL:

```mdx
<MediaEmbed src="/files/presentation.pdf" title="Presentation title" />
<MediaEmbed src="https://www.youtube.com/watch?v=..." title="Video title" />
```

YouTube, Vimeo, PDF, and audio sources receive specialized players. Other URLs render as external-resource cards because many sites prohibit iframe embedding.

Run `npm run dev` to preview changes and `npm run build` to validate the complete static export.
