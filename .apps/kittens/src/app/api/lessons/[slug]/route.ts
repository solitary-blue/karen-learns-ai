import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const curriculumDir = path.resolve(process.cwd(), '../../curriculum');
  const filePath = path.join(curriculumDir, slug + '.md');

  try {
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Lesson not found: ' + filePath }, { status: 404 });
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read lesson' }, { status: 500 });
  }
}
