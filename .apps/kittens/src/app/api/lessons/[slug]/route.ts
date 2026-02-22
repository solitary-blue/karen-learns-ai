import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parseMarkdownToSlides } from '@/lib/markdown';
import type { Slide } from '@/lib/types';

interface LessonError {
  error: string;
}

interface LessonResponse {
  content: string;
  slides: Slide[];
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
    const slides = await parseMarkdownToSlides(content);
    return NextResponse.json<LessonResponse>({ content, slides });
  } catch {
    return NextResponse.json<LessonError>({ error: 'Failed to read lesson' }, { status: 500 });
  }
}
