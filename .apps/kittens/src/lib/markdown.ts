import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { remarkCallout } from './remark-callout';
import type { Slide } from './types';

export async function parseMarkdownToSlides(markdown: string): Promise<Slide[]> {
  // Split by horizontal rule: ---
  const rawSlides = markdown.split(/\n---\n/);
  
  const processor = unified()
    .use(remarkParse)
    .use(remarkCallout)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true });

  const slides = await Promise.all(
    rawSlides.map(async (content) => {
      const result = await processor.process(content);
      // Extract first heading as title
      const titleMatch = content.match(/^#+\s+(.*)$/m);
      const title = titleMatch ? titleMatch[1] : 'Untitled Slide';
      
      return {
        html: result.toString(),
        title: title.startsWith('.') ? title.slice(1).trim() : title,
        hideTitle: title.startsWith('.'),
      };
    })
  );

  return slides;
}
