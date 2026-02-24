import { describe, expect, it } from 'vitest';
import { parseLessonFrontmatter } from './frontmatter';

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
});

