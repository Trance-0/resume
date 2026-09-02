import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="not-found page-container">
      <p className="eyebrow">404 · Lost reference</p>
      <h1>This path is not in the archive.</h1>
      <p>The page may have moved during the static-site migration.</p>
      <Link className="button button-primary" href="/">Return to the overview</Link>
    </section>
  );
}
