import { describe, expect, it } from 'vitest';
import { parseLessonFrontmatter } from './frontmatter';
import {
  FRONTMATTER_CRLF,
  FRONTMATTER_DATE_COERCION,
  FRONTMATTER_EMPTY_BLOCK,
  FRONTMATTER_NESTED_OBJECT,
  FRONTMATTER_NULL_VALUE,
} from '@/test/fixtures';

describe('parseLessonFrontmatter', () => {
  it('returns body unchanged when no frontmatter exists', () => {
    const markdown = '# Title\n\nBody';
    const parsed = parseLessonFrontmatter(markdown);

    expect(parsed.metadata).toEqual({});
    expect(parsed.body).toBe(markdown);
  });

  it('parses Obsidian-style YAML frontmatter and strips it from body', () => {
    const markdown = [
      '---',
      'title: Cosmic Education',
      'aliases:',
      '  - Great Lessons',
      'tags:',
      '  - montessori',
      '  - ai',
      'duration_minutes: 45',
      'draft: false',
      '---',
      '# Slide 1',
      '',
      'Content',
    ].join('\n');

    const parsed = parseLessonFrontmatter(markdown);

    expect(parsed.metadata).toEqual({
      title: 'Cosmic Education',
      aliases: ['Great Lessons'],
      tags: ['montessori', 'ai'],
      duration_minutes: 45,
      draft: false,
    });
    expect(parsed.body).toBe('# Slide 1\n\nContent');
  });

  it('fails open when frontmatter is malformed', () => {
    const markdown = [
      '---',
      'title: [broken',
      '---',
      '# Slide 1',
    ].join('\n');

    const parsed = parseLessonFrontmatter(markdown);

    expect(parsed.metadata).toEqual({});
    expect(parsed.body).toBe(markdown);
  });

  // --- New tests ---

  it('coerces YAML date values to ISO date strings', () => {
    const parsed = parseLessonFrontmatter(FRONTMATTER_DATE_COERCION);

    // js-yaml auto-parses 2024-06-15 as a Date; sanitizeMetadataValue converts to "2024-06-15"
    expect(parsed.metadata.date).toBe('2024-06-15');
    expect(parsed.body).toBe('Body');
  });

  it('handles Windows CRLF line endings', () => {
    const parsed = parseLessonFrontmatter(FRONTMATTER_CRLF);

    expect(parsed.metadata.title).toBe('CRLF Test');
    expect(parsed.body).toBe('Body');
  });

  it('treats empty frontmatter block as no frontmatter (regex requires content line)', () => {
    const parsed = parseLessonFrontmatter(FRONTMATTER_EMPTY_BLOCK);

    // ---\n---\n doesn't match the regex (no content between markers),
    // so the entire input is returned as body — fail-open behavior.
    expect(parsed.metadata).toEqual({});
    expect(parsed.body).toBe(FRONTMATTER_EMPTY_BLOCK);
  });

  it('preserves null values in metadata', () => {
    const parsed = parseLessonFrontmatter(FRONTMATTER_NULL_VALUE);

    expect(parsed.metadata.title).toBe('Test');
    expect(parsed.metadata.subtitle).toBeNull();
  });

  it('silently drops nested objects (not in LessonMetadataValue)', () => {
    const parsed = parseLessonFrontmatter(FRONTMATTER_NESTED_OBJECT);

    expect(parsed.metadata.title).toBe('Test');
    expect(parsed.metadata).not.toHaveProperty('nested');
  });
});
