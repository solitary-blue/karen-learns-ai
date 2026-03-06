import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { remarkQA } from './remark-qa';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { remarkCallout } from './remark-callout';
import type { Slide } from './types';
import { loadAppConfig, pickRandomKitten, pickKittenFromPreferences } from './kitten-config';
import { loadCalloutConfig } from './callout-config';
import { loadThemeConfig } from './theme-parser';
import { visit } from 'unist-util-visit';

export interface SlideAnalysis {
  isHeaderOnly: boolean;
  isCalloutDominant: boolean;
  calloutType?: string;
}

export function analyzeSlideContent(rawMarkdown: string): SlideAnalysis {
  let isHeaderOnly = false;
  let isCalloutDominant = false;
  let calloutType: string | undefined;

  const lines = rawMarkdown.split('\n');
  let headingCount = 0;
  let otherLinesCount = 0;
  let hasCallout = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (/^#+\s/.test(trimmed)) {
      headingCount++;
    } else if (/^>\s*\[!([a-zA-Z0-9+-]+)\]/.test(trimmed)) {
      hasCallout = true;
      const match = trimmed.match(/^>\s*\[!([a-zA-Z0-9+-]+)\]/);
      if (match) calloutType = match[1].toLowerCase();
    } else if (trimmed.startsWith('>')) {
      // part of blockquote/callout
    } else {
      otherLinesCount++;
    }
  }

  isHeaderOnly = headingCount === 1 && otherLinesCount === 0 && !hasCallout;
  
  if (hasCallout && otherLinesCount < loadAppConfig()['kitten-min-other-lines']) {
    isCalloutDominant = true;
  }

  return { isHeaderOnly, isCalloutDominant, calloutType };
}

function resolveKittenForSlide(analysis: SlideAnalysis, themeName?: string): { name: string; height: string; } | undefined {
  let themeMascots;
  if (themeName) {
    const themeConfig = loadThemeConfig();
    themeMascots = themeConfig.themes[themeName]?.definition.mascots;
  }

  if (analysis.isHeaderOnly) {
    if (themeMascots?.header) {
      const kitten = pickKittenFromPreferences(themeMascots.header);
      if (kitten) return { name: kitten.name, height: loadAppConfig()['kitten-size'] };
    }
    
    const kitten = pickRandomKitten();
    if (kitten) {
      return { name: kitten.name, height: loadAppConfig()['kitten-size'] };
    }
  }

  return undefined;
}

function remarkRewriteImages(options: { basePath: string }) {
  return (tree: any) => {
    visit(tree, 'image', (node: any) => {
      if (node.url && !node.url.startsWith('http') && !node.url.startsWith('/')) {
        const prefix = options.basePath ? `${options.basePath}/` : '';
        node.url = `/api/curriculum-images/${prefix}${node.url}`;
      }
    });
  };
}

export async function parseMarkdownToSlides(markdown: string, themeName?: string, lessonSlug?: string): Promise<Slide[]> {
  // Split by horizontal rule: ---
  const rawSlides = markdown.split(/\n---\n/);

  // Extract the directory portion of the lesson slug for relative image resolution
  const basePath = lessonSlug && lessonSlug.includes('/')
    ? lessonSlug.split('/').slice(0, -1).join('/')
    : '';

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkQA)
    .use(remarkCallout)
    .use(remarkRewriteImages, { basePath })
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true });

  const slides = await Promise.all(
    rawSlides.map(async (content) => {
      const result = await processor.process(content);
      // Extract first heading as title
      const titleMatch = content.match(/^#+\s+(.*)$/m);
      const title = titleMatch ? titleMatch[1] : 'Untitled Slide';
      
      const analysis = analyzeSlideContent(content);
      const kitten = resolveKittenForSlide(analysis, themeName);
      
      return {
        html: result.toString(),
        title: title.startsWith('.') ? title.slice(1).trim() : title,
        hideTitle: title.startsWith('.'),
        ...(kitten ? { kitten } : {}),
      };
    })
  );

  return slides;
}
