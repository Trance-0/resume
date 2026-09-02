export interface LinkItem {
  label: string;
  url: string;
}

export interface Profile {
  network: string;
  username: string;
  url: string;
}

export interface Basics {
  name: string;
  email: string;
  phone?: string;
  website?: string;
  summary?: string;
  profiles: Profile[];
}

export interface WorkItem {
  company: string;
  position: string;
  location?: string;
  startDate: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
  category?: string[];
}

export interface EducationItem {
  institution: string;
  area: string;
  studyType: string;
  startDate: string;
  endDate: string;
  majorGpa?: string;
  cumulativeGpa?: string;
  gpa?: string;
  focus?: string[];
  category?: string[];
}

export interface Course {
  name: string;
  level?: string;
  category?: string[];
  tags?: string[];
  description?: string;
  textbooks?: Array<{ name: string; url: string }>;
}

export interface SkillSemester {
  semesters: string;
  courses: Course[];
}

export interface Presentation {
  name: string;
  event: string;
  date: string;
  location?: string;
  description?: string;
  url?: string;
  skills?: string[];
  category?: string[];
}

export interface ProjectStar {
  situation?: string;
  task?: string;
  action?: string;
  result?: string;
}

export interface Project {
  name: string;
  slug: string;
  category?: string;
  topicCategory?: string[];
  date?: string;
  organization?: string;
  'description-keys'?: string[];
  skills?: string[];
  links?: LinkItem[];
  star?: ProjectStar;
  tldr?: string;
  'job-tags'?: string[];
}

export interface QAItem {
  question: string;
  answer: string;
}

export interface ResumeData {
  basics: Basics;
  work: WorkItem[];
  education: EducationItem[];
  skills: SkillSemester[];
  languages: Array<{ name: string; level: string }>;
  presentations: Presentation[];
  portfolio: Project[];
  qa: {
    title: string;
    blurb?: string;
    intro?: string;
    last_updated?: string;
    items: QAItem[];
  };
}

export interface SiteData {
  name: string;
  descriptor: string;
  email: string;
  siteUrl: string;
  hero: {
    eyebrow: string;
    heading: string;
    emphasis: string;
    lead: string;
    notes: Array<{ label: string; value: string }>;
  };
  navigation: Array<{ label: string; href: string }>;
  profiles: Array<{ label: string; href: string }>;
  inquiries: Array<{
    label: string;
    title: string;
    description: string;
    topics: string[];
  }>;
  pathways: Array<{
    title: string;
    description: string;
    items: Array<
      | { type: 'project'; slug: string }
      | { type: 'course'; semester: string; course: string }
    >;
  }>;
}
