import yaml from 'js-yaml';

export type LessonMetadataValue =
  | string
  | number
  | boolean
  | null
  | LessonMetadataValue[];

export type LessonMetadata = Record<string, LessonMetadataValue>;

export interface ParsedLesson {
  metadata: LessonMetadata;
  body: string;
}

const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

function sanitizeMetadataValue(value: unknown): LessonMetadataValue | undefined {
  if (value === null) {
    return null;
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return value;
  }

  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  if (Array.isArray(value)) {
    const sanitizedItems = value
      .map((item) => sanitizeMetadataValue(item))
      .filter((item): item is LessonMetadataValue => item !== undefined);
    return sanitizedItems;
  }

  return undefined;
}

export function parseLessonFrontmatter(markdown: string): ParsedLesson {
  const match = markdown.match(FRONTMATTER_PATTERN);

  if (!match) {
    return { metadata: {}, body: markdown };
  }

  try {
    const rawMetadata = yaml.load(match[1]);
    const metadata: LessonMetadata = {};

    if (rawMetadata && typeof rawMetadata === 'object' && !Array.isArray(rawMetadata)) {
      for (const [key, value] of Object.entries(rawMetadata)) {
        const sanitizedValue = sanitizeMetadataValue(value);
        if (sanitizedValue !== undefined) {
          metadata[key] = sanitizedValue;
        }
      }
    }

    return {
      metadata,
      body: markdown.slice(match[0].length),
    };
  } catch {
    // If frontmatter is malformed, keep the lesson readable as plain markdown.
    return { metadata: {}, body: markdown };
  }
}

