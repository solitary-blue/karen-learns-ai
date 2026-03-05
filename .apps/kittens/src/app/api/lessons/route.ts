import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parseLessonFrontmatter } from '@/lib/frontmatter';
import type { LessonListingResponse, LessonEntry, FolderEntry } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const folderParam = searchParams.get('folder') || '';

  const curriculumDir = process.env.CURRICULUM_DIR
    ?? path.resolve(process.cwd(), '../../curriculum');
  
  const currentPath = path.join(curriculumDir, folderParam);

  try {
    if (!fs.existsSync(currentPath)) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    const stats = fs.statSync(currentPath);
    if (!stats.isDirectory()) {
      return NextResponse.json({ error: 'Not a folder' }, { status: 400 });
    }

    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    
    const lessons: LessonEntry[] = [];
    const folders: FolderEntry[] = [];

    for (const entry of entries) {
      if (entry.name.startsWith('.') || entry.name.startsWith('_')) continue;

      const relativePath = folderParam ? path.join(folderParam, entry.name) : entry.name;

      if (entry.isDirectory()) {
        folders.push({
          name: entry.name,
          label: formatLabel(entry.name, true),
          path: relativePath
        });
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        // Only lessons starting with 00_, 01_, etc.
        if (!/^\d{2}_/.test(entry.name)) continue;
        
        // Skip guide lessons
        if (entry.name.includes('_GUIDE')) continue;

        const fullPath = path.join(currentPath, entry.name);
        const content = fs.readFileSync(fullPath, 'utf-8');
        const { metadata } = parseLessonFrontmatter(content);
        
        const slug = relativePath.replace(/\.md$/, '');
        const title = (metadata.title as string) || entry.name.replace(/\.md$/, '');

        lessons.push({
          slug,
          title,
          label: formatLabel(entry.name.replace(/\.md$/, ''), false)
        });
      }
    }

    const parentPath = folderParam ? (path.dirname(folderParam) === '.' ? '' : path.dirname(folderParam)) : null;
    let parentLabel = null;
    if (folderParam !== '') {
      if (parentPath === '') {
        parentLabel = 'Curriculum';
      } else {
        parentLabel = formatLabel(path.basename(parentPath!), true);
      }
    }

    return NextResponse.json<LessonListingResponse>({
      lessons: lessons.sort((a, b) => a.slug.localeCompare(b.slug)),
      folders: folders.sort((a, b) => a.path.localeCompare(b.path)),
      currentPath: folderParam,
      parentPath,
      parentLabel
    });
  } catch (err) {
    console.error('Failed to list lessons:', err);
    return NextResponse.json({ error: 'Failed to list lessons' }, { status: 500 });
  }
}

function formatLabel(name: string, isFolder: boolean): string {
  if (isFolder) {
    // 01_basics -> 01: Basics
    return name
      .replace(/^(\d{2})_/, '$1: ')
      .replace(/[_-]+/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  } else {
    // 00_karen-learns-ai-roadmap -> Karen Learns Ai Roadmap
    return name
      .replace(/^\d{2}_/, '')
      .replace(/[_-]+/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }
}
