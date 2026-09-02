import type { ReactNode } from 'react';

export function TermNote({ term, note }: { term: string; note: ReactNode }) {
  return (
    <span className="term-note" tabIndex={0}>
      <strong>{term}</strong>
      <span role="tooltip"><small>Working definition</small>{note}</span>
    </span>
  );
}
