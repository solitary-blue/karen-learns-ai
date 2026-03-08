import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getCurriculumDir, getDefaultRootId, getRootById } from '@/lib/curriculum-roots';

const CONTENT_TYPES: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathParts } = await params;
  const imagePath = pathParts.join('/');

  if (imagePath.includes('..') || !/^[a-z0-9_\-\/\.]+$/i.test(imagePath)) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  }

  const ext = path.extname(imagePath).toLowerCase();
  if (!CONTENT_TYPES[ext]) {
    return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
  }

  const url = new URL(request.url);
  const rootParam = url.searchParams.get('root');

  let rootId: string;
  if (rootParam) {
    const root = getRootById(rootParam);
    if (!root) {
      return NextResponse.json({ error: `Invalid root: ${rootParam}` }, { status: 400 });
    }
    rootId = rootParam;
  } else {
    rootId = getDefaultRootId();
  }

  const curriculumDir = getCurriculumDir(rootId);
  const fullPath = path.resolve(curriculumDir, imagePath);

  if (!fullPath.startsWith(path.resolve(curriculumDir))) {
    return NextResponse.json({ error: 'Access denied' }, { status: 403 });
  }

  if (!fs.existsSync(fullPath)) {
    return NextResponse.json({ error: 'Image not found' }, { status: 404 });
  }

  const buffer = fs.readFileSync(fullPath);
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': CONTENT_TYPES[ext],
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
