import type { LessonMetadata } from './frontmatter';

export interface QAItem {
  question: string;
  answer: string;
}

export interface QABlock {
  type: 'callout' | 'bullets' | 'chat';
  title: string;
  items: QAItem[];
}

export interface Slide {
  html: string;
  title: string;
  hideTitle: boolean;
  kitten?: {
    name: string;
    height: string;
  };
}

export interface LessonResponse {
  content: string;
  slides: Slide[];
  metadata: LessonMetadata;
}

export interface LessonEntry {
  slug: string;
  title: string;
  label: string;
}

export interface FolderEntry {
  name: string;
  label: string;
  path: string;
}

export interface LessonListingResponse {
  lessons: LessonEntry[];
  folders: FolderEntry[];
  currentPath: string;
  parentPath: string | null;
  parentLabel: string | null;
}
