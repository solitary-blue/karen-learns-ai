import { describe, expect, it, vi } from 'vitest';
import { TEST_CALLOUT_CONFIG } from '@/test/fixtures';

vi.mock('./callout-config', () => ({
  loadCalloutConfig: () => TEST_CALLOUT_CONFIG,
}));

import { parseMarkdownToSlides } from './markdown';

describe('parseMarkdownToSlides', () => {
  it('splits on \\n---\\n into separate slides', async () => {
    const md = '# Slide 1\n\nContent 1\n\n---\n\n# Slide 2\n\nContent 2';
    const slides = await parseMarkdownToSlides(md);

    expect(slides).toHaveLength(2);
  });

  it('extracts heading text as title', async () => {
    const md = '# My Slide Title\n\nBody text.';
    const slides = await parseMarkdownToSlides(md);

    expect(slides[0].title).toBe('My Slide Title');
  });

  it('uses "Untitled Slide" when no heading exists', async () => {
    const md = 'Just body text with no heading.';
    const slides = await parseMarkdownToSlides(md);

    expect(slides[0].title).toBe('Untitled Slide');
  });

  it('strips dot prefix and sets hideTitle: true', async () => {
    const md = '# .Hidden Title\n\nBody text.';
    const slides = await parseMarkdownToSlides(md);

    expect(slides[0].title).toBe('Hidden Title');
    expect(slides[0].hideTitle).toBe(true);
  });

  it('sets hideTitle: false for normal titles', async () => {
    const md = '# Normal Title\n\nBody text.';
    const slides = await parseMarkdownToSlides(md);

    expect(slides[0].hideTitle).toBe(false);
  });

  it('renders markdown to HTML (bold, etc.)', async () => {
    const md = '# Title\n\nThis is **bold** text.';
    const slides = await parseMarkdownToSlides(md);

    expect(slides[0].html).toContain('<strong>bold</strong>');
  });

  it('processes callout blockquotes', async () => {
    const md = '# Title\n\n> [!note]\n> Callout content.';
    const slides = await parseMarkdownToSlides(md);

    expect(slides[0].html).toContain('callout-note');
    expect(slides[0].html).toContain('Callout content.');
  });

  it('handles single slide (no separators) and empty string', async () => {
    const single = '# Only Slide\n\nContent.';
    const slides = await parseMarkdownToSlides(single);
    expect(slides).toHaveLength(1);
    expect(slides[0].title).toBe('Only Slide');

    const empty = await parseMarkdownToSlides('');
    expect(empty).toHaveLength(1);
    expect(empty[0].title).toBe('Untitled Slide');
  });
});
