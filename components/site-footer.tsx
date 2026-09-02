import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { SiteData } from '@/lib/types';

export function SiteFooter({ site }: { site: SiteData }) {
  return (
    <footer className="site-footer">
      <div className="page-container footer-grid">
        <div>
          <h2>{site.name}</h2>
        </div>
        <div>
          <h3>Explore</h3>
          {site.navigation.slice(0, 4).map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
        </div>
        <div>
          <h3>Connect</h3>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          {site.profiles.map((profile) => (
            <a key={profile.href} href={profile.href} target="_blank" rel="noreferrer">
              {profile.label} <ArrowUpRight size={13} />
            </a>
          ))}
        </div>
      </div>
      <div className="page-container footer-base">
        <span>Static by design. Content in MDX.</span>
        <div><Link href="/terms/">Privacy</Link><Link href="/sitemap/">Sitemap</Link></div>
      </div>
    </footer>
  );
}
