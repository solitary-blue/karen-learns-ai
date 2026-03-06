import { describe, expect, it, vi } from 'vitest';
import {
  TEST_CALLOUT_CONFIG,
  HEADER_ONLY_SLIDE,
  HEADER_ONLY_WITH_BLANKS,
  MULTI_HEADING_SLIDE,
  CALLOUT_DOMINANT_SLIDE,
  CALLOUT_WITH_EXTRA_CONTENT,
  NORMAL_CONTENT_SLIDE,
  WARNING_CALLOUT_SLIDE,
} from '@/test/fixtures';

vi.mock('./callout-config', () => ({
  loadCalloutConfig: () => ({
    callouts: {
      ...TEST_CALLOUT_CONFIG.callouts,
      tip: {
        ...TEST_CALLOUT_CONFIG.callouts.tip,
        kittens: ['suit-arms-crossed']
      }
    }
  }),
}));

vi.mock('./kitten-config', () => ({
  loadAppConfig: () => ({
    'kitten-size': '280px',
    'callout-kitten-size': '180px',
    'kitten-min-other-lines': 3,
  }),
  pickRandomKitten: () => ({ name: 'suit-arms-crossed', filePath: '/fake/path.png' }),
  pickKittenFromPreferences: (prefs: string | string[]) => ({
    name: Array.isArray(prefs) ? prefs[0] : prefs,
    filePath: '/fake/path.png',
  }),
}));

vi.mock('./theme-parser', () => ({
  loadThemeConfig: () => ({
    defaultTheme: 'montessori',
    themes: {
      dracula: {
        definition: {
          mascots: {
            header: ['dracula-header-mascot'],
            callouts: {
              tip: ['dracula-tip-mascot']
            }
          }
        }
      }
    }
  })
}));

import { parseMarkdownToSlides, analyzeSlideContent } from './markdown';

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

  it('renders GFM tables to HTML', async () => {
    const md = '# Comparison\n\n| Left | Right |\n|---|---|\n| Chat | Terminal |\n| Send | Enter |';
    const slides = await parseMarkdownToSlides(md);

    expect(slides[0].html).toContain('<table>');
    expect(slides[0].html).toContain('<th>Left</th>');
    expect(slides[0].html).toContain('<td>Chat</td>');
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

  it('rewrites relative image paths using lesson slug directory', async () => {
    const md = '# Diagram Slide\n\n![Overview](diagrams/overview.png)';
    const slides = await parseMarkdownToSlides(md, undefined, 'section-1/01_lesson_KAREN');

    expect(slides[0].html).toContain('src="/api/curriculum-images/section-1/diagrams/overview.png"');
  });

  it('does not rewrite absolute or external image paths', async () => {
    const md = '# Slide\n\n![Abs](/images/logo.png)\n\n![Ext](https://example.com/pic.jpg)';
    const slides = await parseMarkdownToSlides(md, undefined, 'section-1/01_lesson_KAREN');

    expect(slides[0].html).toContain('src="/images/logo.png"');
    expect(slides[0].html).toContain('src="https://example.com/pic.jpg"');
  });

  it('handles images when no lesson slug is provided', async () => {
    const md = '# Slide\n\n![Img](diagrams/test.png)';
    const slides = await parseMarkdownToSlides(md);

    expect(slides[0].html).toContain('src="/api/curriculum-images/diagrams/test.png"');
  });
});

describe('analyzeSlideContent', () => {
  it('identifies header-only slide', () => {
    const analysis = analyzeSlideContent(HEADER_ONLY_SLIDE);
    expect(analysis.isHeaderOnly).toBe(true);
    expect(analysis.isCalloutDominant).toBe(false);
  });

  it('identifies header-only slide with blank lines', () => {
    const analysis = analyzeSlideContent(HEADER_ONLY_WITH_BLANKS);
    expect(analysis.isHeaderOnly).toBe(true);
  });

  it('multi-heading slide is not header-only', () => {
    const analysis = analyzeSlideContent(MULTI_HEADING_SLIDE);
    expect(analysis.isHeaderOnly).toBe(false);
  });

  it('identifies callout-dominant slide', () => {
    const analysis = analyzeSlideContent(CALLOUT_DOMINANT_SLIDE);
    expect(analysis.isCalloutDominant).toBe(true);
    expect(analysis.calloutType).toBe('tip');
  });

  it('callout with too many extra lines is not dominant', () => {
    const analysis = analyzeSlideContent(CALLOUT_WITH_EXTRA_CONTENT);
    expect(analysis.isCalloutDominant).toBe(false);
  });

  it('normal content is neither', () => {
    const analysis = analyzeSlideContent(NORMAL_CONTENT_SLIDE);
    expect(analysis.isHeaderOnly).toBe(false);
    expect(analysis.isCalloutDominant).toBe(false);
  });
});

describe('parseMarkdownToSlides kitten injection', () => {
  it('injects kitten into header-only slide', async () => {
    const slides = await parseMarkdownToSlides(HEADER_ONLY_SLIDE);
    expect(slides[0].kitten).toBeDefined();
    expect(slides[0].kitten?.height).toBe('280px');
  });

  it('does not inject kitten into callout-dominant slide (handled by remark-callout)', async () => {
    const slides = await parseMarkdownToSlides(CALLOUT_DOMINANT_SLIDE);
    expect(slides[0].kitten).toBeUndefined();
  });

  it('does not inject kitten into normal content slide', async () => {
    const slides = await parseMarkdownToSlides(NORMAL_CONTENT_SLIDE);
    expect(slides[0].kitten).toBeUndefined();
  });

  it('uses theme mascot overrides for header slides if theme provided', async () => {
    const slides = await parseMarkdownToSlides(HEADER_ONLY_SLIDE, 'dracula');
    expect(slides[0].kitten).toBeDefined();
    expect(slides[0].kitten?.name).toBe('dracula-header-mascot');
  });
});
