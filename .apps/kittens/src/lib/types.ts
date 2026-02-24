import type { LessonMetadata } from './frontmatter';

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
