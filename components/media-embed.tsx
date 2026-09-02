import { ExternalLink, FileText, Headphones } from 'lucide-react';
import { withBasePath } from '@/lib/base-path';

interface MediaEmbedProps {
  src: string;
  title: string;
  kind?: 'auto' | 'video' | 'audio' | 'pdf' | 'link';
}

export function MediaEmbed({ src, title, kind = 'auto' }: MediaEmbedProps) {
  const resolvedSrc = withBasePath(src);
  const detected = kind === 'auto' ? detectKind(src) : kind;
  const video = getVideoEmbed(src);

  if (detected === 'video' && video) {
    return (
      <figure className="media-embed">
        <div className="media-frame"><iframe src={video} title={title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div>
        <figcaption>{title}</figcaption>
      </figure>
    );
  }

  if (detected === 'audio') {
    return <figure className="media-embed media-audio"><Headphones size={22} /><div><figcaption>{title}</figcaption><audio controls preload="metadata" src={resolvedSrc}>Your browser does not support audio playback.</audio></div></figure>;
  }

  if (detected === 'pdf') {
    return (
      <figure className="media-embed media-pdf">
        <div className="media-frame"><iframe src={`${resolvedSrc}#view=FitH`} title={title} loading="lazy" /></div>
        <figcaption><FileText size={15} /> {title} <a href={resolvedSrc} target="_blank" rel="noreferrer">Open PDF <ExternalLink size={12} /></a></figcaption>
      </figure>
    );
  }

  return <a className="media-link-card" href={resolvedSrc} target="_blank" rel="noreferrer"><span><small>External resource</small><strong>{title}</strong></span><ExternalLink size={18} /></a>;
}

function detectKind(src: string): Exclude<MediaEmbedProps['kind'], 'auto'> {
  if (/\.(mp3|wav|ogg)(\?.*)?$/i.test(src)) return 'audio';
  if (/\.pdf(\?.*)?$/i.test(src)) return 'pdf';
  if (/youtube\.com|youtu\.be|vimeo\.com/i.test(src)) return 'video';
  return 'link';
}

function getVideoEmbed(src: string) {
  const youtube = src.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{6,})/i);
  if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube[1]}`;
  const vimeo = src.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}
