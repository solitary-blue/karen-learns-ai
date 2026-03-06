import { describe, expect, it, vi } from 'vitest';

vi.mock('./callout-config', () => ({
  loadCalloutConfig: () => ({
    callouts: {
      note: { title: 'Note', icon: 'FileText', color: 'text-blue-600', backgroundColor: 'bg-blue-50', borderColor: 'border-blue-200' },
    },
  }),
}));

vi.mock('./kitten-config', () => ({
  loadAppConfig: () => ({ 'kitten-size': '280px', 'callout-kitten-size': '180px', 'kitten-min-other-lines': 3 }),
  pickRandomKitten: () => null,
  pickKittenFromPreferences: () => null,
}));

vi.mock('./theme-parser', () => ({
  loadThemeConfig: () => ({ defaultTheme: 'montessori', themes: {} }),
}));

import { parseMarkdownToSlides } from './markdown';
import type { QABlock } from './types';

function extractQABlock(html: string): QABlock | null {
  const match = html.match(/<!--qa:(.*?):qa-->/);
  return match ? JSON.parse(match[1]) : null;
}

describe('remarkQA', () => {
  describe('[!QUESTION] callout pattern', () => {
    it('transforms a QUESTION callout with Q/A bullet list', async () => {
      const md = [
        '> [!QUESTION] Think About It',
        '> - What is an agent?',
        '>   - An AI that can take actions',
        '> - What is a chatbot?',
        '>   - An AI that only responds with text',
      ].join('\n');

      const slides = await parseMarkdownToSlides(md);
      const block = extractQABlock(slides[0].html);

      expect(block).not.toBeNull();
      expect(block!.type).toBe('callout');
      expect(block!.title).toBe('Think About It');
      expect(block!.items).toHaveLength(2);
      expect(block!.items[0].question).toBe('What is an agent?');
      expect(block!.items[0].answer).toBe('An AI that can take actions');
      expect(block!.items[1].question).toBe('What is a chatbot?');
    });

    it('falls through to regular callout when no list is present', async () => {
      const md = [
        '> [!QUESTION] Just a Note',
        '> This has no bullet list, just text.',
      ].join('\n');

      const slides = await parseMarkdownToSlides(md);

      // Should NOT have a QA marker — should be a regular callout
      expect(slides[0].html).not.toContain('<!--qa:');
      // The regular callout plugin should handle it
      expect(slides[0].html).toContain('callout');
    });

    it('uses default title when none given', async () => {
      const md = [
        '> [!QUESTION]',
        '> - Q1?',
        '>   - A1',
      ].join('\n');

      const slides = await parseMarkdownToSlides(md);
      const block = extractQABlock(slides[0].html);

      expect(block!.title).toBe('Question');
    });
  });

  describe('[!QUIZ] chat pattern', () => {
    it('transforms a QUIZ callout into a chat block', async () => {
      const md = [
        '> [!QUIZ] Check Understanding',
        '> - First question?',
        '>   - First answer',
        '> - Second question?',
        '>   - Second answer',
      ].join('\n');

      const slides = await parseMarkdownToSlides(md);
      const block = extractQABlock(slides[0].html);

      expect(block!.type).toBe('chat');
      expect(block!.title).toBe('Check Understanding');
      expect(block!.items).toHaveLength(2);
    });

    it('uses default title "Quiz" when none given', async () => {
      const md = [
        '> [!QUIZ]',
        '> - Q?',
        '>   - A',
      ].join('\n');

      const slides = await parseMarkdownToSlides(md);
      const block = extractQABlock(slides[0].html);

      expect(block!.title).toBe('Quiz');
    });
  });

  describe('#quiz heading pattern', () => {
    it('transforms a heading with #quiz and following list', async () => {
      const md = [
        '## Review #quiz',
        '',
        '- What is iTerm?',
        '  - A terminal application',
        '- How do you start Claude?',
        '  - Type claude and press Enter',
      ].join('\n');

      const slides = await parseMarkdownToSlides(md);
      const block = extractQABlock(slides[0].html);

      expect(block!.type).toBe('bullets');
      expect(block!.title).toBe('Review');
      expect(block!.items).toHaveLength(2);
      expect(block!.items[0].question).toBe('What is iTerm?');
      expect(block!.items[0].answer).toBe('A terminal application');
    });

    it('ignores heading with #quiz if no list follows', async () => {
      const md = [
        '## Something #quiz',
        '',
        'Just a paragraph, no list.',
      ].join('\n');

      const slides = await parseMarkdownToSlides(md);

      expect(slides[0].html).not.toContain('<!--qa:');
      // Heading should render normally (with #quiz as text)
      expect(slides[0].html).toContain('#quiz');
    });

    it('consumes the list node so it does not render twice', async () => {
      const md = [
        '## Quiz Time #quiz',
        '',
        '- Q1?',
        '  - A1',
      ].join('\n');

      const slides = await parseMarkdownToSlides(md);

      // The list should not appear as regular HTML
      expect(slides[0].html).not.toContain('<ul>');
      expect(slides[0].html).not.toContain('<li>');
    });
  });

  describe('questions without answers', () => {
    it('extracts questions even when answers are missing', async () => {
      const md = [
        '> [!QUESTION] Open Reflection',
        '> - What did you learn today?',
        '> - What would you do differently?',
      ].join('\n');

      const slides = await parseMarkdownToSlides(md);
      const block = extractQABlock(slides[0].html);

      expect(block!.items).toHaveLength(2);
      expect(block!.items[0].question).toBe('What did you learn today?');
      expect(block!.items[0].answer).toBe('');
    });
  });

  describe('coexistence with regular content', () => {
    it('preserves surrounding content in the slide', async () => {
      const md = [
        '# Slide Title',
        '',
        'Some intro text.',
        '',
        '> [!QUESTION] Quick Check',
        '> - What is this?',
        '>   - A test',
        '',
        'Some outro text.',
      ].join('\n');

      const slides = await parseMarkdownToSlides(md);

      expect(slides[0].html).toContain('Slide Title');
      expect(slides[0].html).toContain('Some intro text.');
      expect(slides[0].html).toContain('Some outro text.');
      expect(slides[0].html).toContain('<!--qa:');
    });
  });
});
