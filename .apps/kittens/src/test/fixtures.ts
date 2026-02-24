import type { CalloutsConfig } from '@/lib/callout-config';

// --- Lesson fixtures ---

export const SIMPLE_LESSON = [
  '---',
  'title: Cosmic Education',
  'tags:',
  '  - montessori',
  '---',
  '# Slide One',
  '',
  'First slide content.',
  '',
  '---',
  '',
  '# Slide Two',
  '',
  'Second slide content.',
].join('\n');

export const LESSON_WITH_CALLOUT = [
  '# Callout Slide',
  '',
  '> [!note]',
  '> This is a note callout.',
].join('\n');

export const LESSON_HIDDEN_TITLE = [
  '# .Hidden Title Here',
  '',
  'This slide has a dot-prefix hidden title.',
].join('\n');

// --- Frontmatter edge cases ---

export const FRONTMATTER_DATE_COERCION = [
  '---',
  'date: 2024-06-15',
  '---',
  'Body',
].join('\n');

export const FRONTMATTER_CRLF = '---\r\ntitle: CRLF Test\r\n---\r\nBody';

export const FRONTMATTER_EMPTY_BLOCK = '---\n---\nBody after empty frontmatter';

export const FRONTMATTER_NULL_VALUE = [
  '---',
  'title: Test',
  'subtitle: null',
  '---',
  'Body',
].join('\n');

export const FRONTMATTER_NESTED_OBJECT = [
  '---',
  'title: Test',
  'nested:',
  '  key: value',
  '---',
  'Body',
].join('\n');

// --- Callout config fixture ---

export const TEST_CALLOUT_CONFIG: CalloutsConfig = {
  callouts: {
    note: {
      type: 'note',
      title: 'Note',
      icon: 'FileText',
      color: 'text-blue-600',
      backgroundColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    tip: {
      type: 'tip',
      title: 'Tip',
      icon: 'Flame',
      color: 'text-teal-600',
      backgroundColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      aliases: ['hint', 'important'],
    },
    // Alias entries pointing to tip config
    hint: {
      type: 'tip',
      title: 'Tip',
      icon: 'Flame',
      color: 'text-teal-600',
      backgroundColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      aliases: ['hint', 'important'],
    },
    important: {
      type: 'tip',
      title: 'Tip',
      icon: 'Flame',
      color: 'text-teal-600',
      backgroundColor: 'bg-teal-50',
      borderColor: 'border-teal-200',
      aliases: ['hint', 'important'],
    },
  },
};
