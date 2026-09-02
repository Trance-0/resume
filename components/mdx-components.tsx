import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import type { MDXComponents } from 'mdx/types';
import { resume, site } from '@/lib/content';
import { HomeHeroClient, InquiryTabsClient, FeaturedProjectsClient } from '@/components/home-widgets';
import { PortfolioExplorerClient } from '@/components/portfolio-explorer';
import { ResumeViewClient } from '@/components/resume-view';
import { CourseArchiveClient, SkillAtlasClient } from '@/components/skill-atlas';
import { PathwaysClient, QAListClient, SitemapGridClient, TalksArchiveClient } from '@/components/content-widgets';
import { TermNote } from '@/components/term-note';
import { MediaEmbed } from '@/components/media-embed';

function SmartLink({ href = '', children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  const external = /^(https?:)?\/\//.test(href);
  if (external) {
    return <a href={href} target="_blank" rel="noreferrer" {...props}>{children}<ExternalLink className="external-icon" size={12} /></a>;
  }
  return <Link href={href} {...props}>{children}</Link>;
}

function HomeHero() {
  return <HomeHeroClient site={site} latestProject={resume.portfolio[0]} />;
}

function InquiryTabs() {
  return <InquiryTabsClient inquiries={site.inquiries} />;
}

function FeaturedProjects() {
  return <FeaturedProjectsClient projects={resume.portfolio} />;
}

function ResumeView() {
  return <ResumeViewClient resume={resume} />;
}

function PortfolioExplorer() {
  return <PortfolioExplorerClient projects={resume.portfolio} />;
}

function SkillAtlas() {
  return <SkillAtlasClient resume={resume} />;
}

function CourseArchive() {
  return <CourseArchiveClient semesters={resume.skills} />;
}

function TalksArchive() {
  return <TalksArchiveClient talks={resume.presentations} />;
}

function Pathways() {
  return <PathwaysClient pathways={site.pathways} projects={resume.portfolio} semesters={resume.skills} />;
}

function QAList() {
  return <QAListClient items={resume.qa.items} updated={resume.qa.last_updated} />;
}

function SitemapGrid() {
  return <SitemapGridClient navigation={site.navigation} />;
}

const components: MDXComponents = {
  a: SmartLink,
  HomeHero,
  InquiryTabs,
  FeaturedProjects,
  ResumeView,
  PortfolioExplorer,
  SkillAtlas,
  CourseArchive,
  TalksArchive,
  Pathways,
  QAList,
  SitemapGrid,
  TermNote,
  MediaEmbed,
};

export function getMDXComponents(overrides?: MDXComponents): MDXComponents {
  return { ...components, ...overrides };
}
