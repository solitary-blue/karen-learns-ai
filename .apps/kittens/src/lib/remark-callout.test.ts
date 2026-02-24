import { describe, expect, it, vi } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { TEST_CALLOUT_CONFIG } from '@/test/fixtures';

vi.mock('./callout-config', () => ({
  loadCalloutConfig: () => TEST_CALLOUT_CONFIG,
}));

import { remarkCallout } from './remark-callout';

function processMarkdown(md: string): Promise<string> {
  return unified()
    .use(remarkParse)
    .use(remarkCallout)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(md)
    .then((r) => r.toString());
}

describe('remarkCallout', () => {
  it('transforms [!note] blockquote into callout HTML with icon SVG', async () => {
    const md = '> [!note]\n> This is a note.';
    const html = await processMarkdown(md);

    expect(html).toContain('callout-note');
    expect(html).toContain('callout-title');
    expect(html).toContain('<svg');
    expect(html).toContain('Note');
    expect(html).toContain('This is a note.');
  });

  it('uses custom title when provided after type', async () => {
    const md = '> [!tip] My Custom Title\n> Some content.';
    const html = await processMarkdown(md);

    expect(html).toContain('My Custom Title');
    expect(html).toContain('callout-tip');
    expect(html).toContain('Some content.');
  });

  it('resolves aliases to the correct config', async () => {
    const md = '> [!important]\n> Aliased content.';
    const html = await processMarkdown(md);

    // "important" is an alias for "tip" — should get tip's styling
    expect(html).toContain('callout-important');
    expect(html).toContain('bg-teal-50');
    expect(html).toContain('Aliased content.');
  });

  it('falls back to note config for unknown callout types', async () => {
    const md = '> [!custom]\n> Unknown type content.';
    const html = await processMarkdown(md);

    expect(html).toContain('callout-custom');
    // Falls back to note config
    expect(html).toContain('bg-blue-50');
    expect(html).toContain('Unknown type content.');
  });

  it('leaves regular blockquotes untouched', async () => {
    const md = '> Just a regular blockquote.';
    const html = await processMarkdown(md);

    expect(html).toContain('<blockquote>');
    expect(html).not.toContain('callout');
  });

  it('handles multi-paragraph callout content', async () => {
    const md = '> [!note]\n> First paragraph.\n>\n> Second paragraph.';
    const html = await processMarkdown(md);

    expect(html).toContain('callout-note');
    expect(html).toContain('First paragraph.');
    expect(html).toContain('Second paragraph.');
  });
});
