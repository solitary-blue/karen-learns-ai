import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parseMarkdownToSlides } from '@/lib/markdown';
import { parseLessonFrontmatter } from '@/lib/frontmatter';
import type { LessonResponse } from '@/lib/types';

interface LessonError {
  error: string;
}

const VALID_SLUG_PATTERN = /^[a-z0-9_-]+$/i;

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!VALID_SLUG_PATTERN.test(slug)) {
    return NextResponse.json<LessonError>({ error: 'Invalid lesson slug' }, { status: 400 });
  }

  const curriculumDir = process.env.CURRICULUM_DIR
    ?? path.resolve(process.cwd(), '../../curriculum');
  const filePath = path.join(curriculumDir, slug + '.md');

  try {
    if (!fs.existsSync(filePath)) {
      return NextResponse.json<LessonError>({ error: 'Lesson not found' }, { status: 404 });
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsedLesson = parseLessonFrontmatter(content);
    const slides = await parseMarkdownToSlides(parsedLesson.body);
    return NextResponse.json<LessonResponse>({
      content,
      slides,
      metadata: parsedLesson.metadata,
    });
  } catch {
    return NextResponse.json<LessonError>({ error: 'Failed to read lesson' }, { status: 500 });
  }
}
