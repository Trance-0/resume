'use client';

import { AnchorProvider, ScrollProvider, TOCItem, type TOCItemType } from 'fumadocs-core/toc';
import { useRef } from 'react';

export function TableOfContents({ items }: { items: TOCItemType[] }) {
  const viewRef = useRef<HTMLDivElement>(null);
  return (
    <AnchorProvider toc={items}>
      <aside className="toc" aria-label="On this page">
        <p>On this page</p>
        <div ref={viewRef} className="toc-scroll">
          <ScrollProvider containerRef={viewRef}>
            {items.map((item) => (
              <TOCItem key={item.url} href={item.url} className={`toc-depth-${item.depth}`}>
                {item.title}
              </TOCItem>
            ))}
          </ScrollProvider>
        </div>
      </aside>
    </AnchorProvider>
  );
}
