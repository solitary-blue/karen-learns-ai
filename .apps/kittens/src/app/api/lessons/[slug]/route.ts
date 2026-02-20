import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface LessonError {
  error: string;
}

interface LessonResponse {
  content: string;
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
    return NextResponse.json<LessonResponse>({ content });
  } catch {
    return NextResponse.json<LessonError>({ error: 'Failed to read lesson' }, { status: 500 });
  }
}
