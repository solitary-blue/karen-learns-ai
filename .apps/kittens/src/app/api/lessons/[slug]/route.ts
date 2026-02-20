import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (/[./\\]/.test(slug)) {
    return NextResponse.json({ error: 'Invalid lesson slug' }, { status: 400 });
  }

  const curriculumDir = process.env.CURRICULUM_DIR
    ?? path.resolve(process.cwd(), '../../curriculum');
  const filePath = path.join(curriculumDir, slug + '.md');

  try {
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read lesson' }, { status: 500 });
  }
}
