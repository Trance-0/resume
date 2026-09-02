import type { Metadata, Viewport } from 'next';
import { NextProvider } from 'fumadocs-core/framework/next';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { ScrollProgress } from '@/components/scroll-progress';
import { withBasePath } from '@/lib/base-path';
import { site } from '@/lib/content';
import 'computer-modern/cmu-serif.css';
import 'computer-modern/cmu-typewriter-text.css';
import './globals.css';
import '@xyflow/react/dist/style.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.siteUrl),
  title: {
    default: `${site.name} — Resume`,
    template: `%s — ${site.name}`,
  },
  description: 'Computer scientist and mathematician building tools for learning, reasoning, and human agency.',
  icons: { icon: withBasePath('/favicon.svg') },
  openGraph: {
    type: 'website',
    title: `${site.name} — Resume`,
    description: 'Computer science, mathematics, research, and engineering portfolio.',
    url: site.siteUrl,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f5ef' },
    { media: '(prefers-color-scheme: dark)', color: '#101820' },
  ],
};

const themeScript = `
  (() => {
    try {
      const saved = localStorage.getItem('theme');
      const dark = saved ? saved === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.dataset.theme = dark ? 'dark' : 'light';
    } catch {}
  })();
`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <NextProvider>
          <a className="skip-link" href="#main-content">Skip to content</a>
          <ScrollProgress />
          <SiteHeader site={site} />
          <main id="main-content">{children}</main>
          <SiteFooter site={site} />
        </NextProvider>
      </body>
    </html>
  );
}
