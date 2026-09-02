import type { TOCItemType } from 'fumadocs-core/toc';
import type { ReactNode } from 'react';
import { TableOfContents } from '@/components/table-of-contents';

interface PageShellProps {
  title: string;
  description?: string;
  eyebrow?: string;
  layout: 'landing' | 'article' | 'wide';
  toc: TOCItemType[];
  children: ReactNode;
}

export function PageShell({ title, description, eyebrow, layout, toc, children }: PageShellProps) {
  if (layout === 'landing') {
    return <article className="landing-page mdx-content">{children}</article>;
  }

  return (
    <article className={`content-page page-container layout-${layout}`}>
      <header className="page-heading">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {description && <p className="page-description">{description}</p>}
      </header>
      <div className="content-layout">
        <div className="mdx-content">{children}</div>
        {toc.length > 0 && <TableOfContents items={toc} />}
      </div>
    </article>
  );
}
