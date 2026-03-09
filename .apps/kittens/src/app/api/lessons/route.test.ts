import { describe, expect, it, vi, beforeEach } from 'vitest';
import fs from 'fs';

vi.mock('@/lib/server-utils', () => ({
  getProjectRoot: () => '/mock/project',
}));

vi.mock('@/lib/curriculum-roots', () => ({
  getCurriculumDir: (rootId: string) => {
    if (rootId === 'current') return '/mock/curriculum';
    if (rootId === 'workspace') return '/mock/workspace/curriculum';
    throw new Error(`Unknown curriculum root id: ${rootId}`);
  },
  getDefaultRootId: () => 'current',
  getRootById: (rootId: string) => {
    if (rootId === 'current') return { id: 'current', label: 'Current', 'path-segments': [''], 'enclosing-dir': 'current' };
    if (rootId === 'workspace') return { id: 'workspace', label: 'Workspace', 'path-segments': ['workspace'], 'enclosing-dir': 'workspace' };
    return null;
  },
  validateCurriculumDir: (rootId: string) => rootId === 'current' || rootId === 'workspace',
}));

import { GET } from './route';

function makeRequest(folder?: string, root?: string): Request {
  const url = new URL('http://localhost:3000/api/lessons');
  if (folder) url.searchParams.set('folder', folder);
  if (root) url.searchParams.set('root', root);
  return new Request(url.toString());
}

describe('GET /api/lessons', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 400 for path traversal attempts', async () => {
    const res = await GET(makeRequest('../etc'));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('Invalid folder path');
  });

  it('returns 400 for folder with dots', async () => {
    const res = await GET(makeRequest('foo/../bar'));
    expect(res.status).toBe(400);
  });

  it('returns 400 for folder with spaces', async () => {
    const res = await GET(makeRequest('folder with spaces'));
    expect(res.status).toBe(400);
  });

  it('returns 404 when folder does not exist', async () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(false);

    const res = await GET(makeRequest('nonexistent'));
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toContain('not found');
  });

  it('returns 400 when path is not a directory', async () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'statSync').mockReturnValue({ isDirectory: () => false } as any);

    const res = await GET(makeRequest('some-file'));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('Not a folder');
  });

  it('lists folders and lessons from curriculum root', async () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'statSync').mockReturnValue({ isDirectory: () => true } as any);
    vi.spyOn(fs, 'readdirSync').mockReturnValue([
      { name: '01_basics', isDirectory: () => true, isFile: () => false },
      { name: '01_intro.md', isDirectory: () => false, isFile: () => true },
      { name: '.hidden', isDirectory: () => true, isFile: () => false },
      { name: '_private.md', isDirectory: () => false, isFile: () => true },
      { name: 'readme.md', isDirectory: () => false, isFile: () => true },
      { name: '02_GUIDE_teacher.md', isDirectory: () => false, isFile: () => true },
    ] as any);
    vi.spyOn(fs, 'readFileSync').mockReturnValue('---\ntitle: Intro Lesson\n---\n# Hello');

    const res = await GET(makeRequest());
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.folders).toHaveLength(1);
    expect(body.folders[0].label).toBe('Basics');
    expect(body.lessons).toHaveLength(1);
    expect(body.lessons[0].title).toBe('Intro Lesson');
    expect(body.parentPath).toBeNull();
  });

  it('includes hyphenated lesson filenames with numeric prefixes', async () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'statSync').mockReturnValue({ isDirectory: () => true } as any);
    vi.spyOn(fs, 'readdirSync').mockReturnValue([
      { name: '01-kitten-fun-facts.md', isDirectory: () => false, isFile: () => true },
    ] as any);
    vi.spyOn(fs, 'readFileSync').mockReturnValue('---\ntitle: Kitten Fun Facts\n---\n# Hello');

    const res = await GET(makeRequest('', 'workspace'));
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.lessons).toHaveLength(1);
    expect(body.lessons[0].slug).toBe('01-kitten-fun-facts');
    expect(body.lessons[0].label).toBe('Kitten Fun Facts');
  });

  it('skips GUIDE lessons', async () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'statSync').mockReturnValue({ isDirectory: () => true } as any);
    vi.spyOn(fs, 'readdirSync').mockReturnValue([
      { name: '01_GUIDE_for_teachers.md', isDirectory: () => false, isFile: () => true },
    ] as any);

    const res = await GET(makeRequest());
    const body = await res.json();
    expect(body.lessons).toHaveLength(0);
  });

  it('skips hyphenated GUIDE lessons', async () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'statSync').mockReturnValue({ isDirectory: () => true } as any);
    vi.spyOn(fs, 'readdirSync').mockReturnValue([
      { name: '01-GUIDE-for-teachers.md', isDirectory: () => false, isFile: () => true },
      { name: '02-student-lesson.md', isDirectory: () => false, isFile: () => true },
    ] as any);
    vi.spyOn(fs, 'readFileSync').mockReturnValue('---\ntitle: Student Lesson\n---\n# Hello');

    const res = await GET(makeRequest('', 'workspace'));
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.lessons).toHaveLength(1);
    expect(body.lessons[0].slug).toBe('02-student-lesson');
  });

  it('computes parentPath and parentLabel for subfolder', async () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'statSync').mockReturnValue({ isDirectory: () => true } as any);
    vi.spyOn(fs, 'readdirSync').mockReturnValue([] as any);

    const res = await GET(makeRequest('01_basics'));
    const body = await res.json();
    expect(body.parentPath).toBe('');
    expect(body.parentLabel).toBe('Curriculum');
  });

  it('allows valid folder names with hyphens and numbers', async () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'statSync').mockReturnValue({ isDirectory: () => true } as any);
    vi.spyOn(fs, 'readdirSync').mockReturnValue([] as any);

    const res = await GET(makeRequest('01_basics/02_advanced'));
    expect(res.status).toBe(200);
  });

  it('uses root query param to select curriculum directory', async () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'statSync').mockReturnValue({ isDirectory: () => true } as any);
    vi.spyOn(fs, 'readdirSync').mockReturnValue([] as any);

    const res = await GET(makeRequest('', 'workspace'));
    expect(res.status).toBe(200);
  });

  it('returns 400 for invalid root id', async () => {
    const res = await GET(makeRequest('', 'invalid-root'));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('Invalid root');
  });

  it('falls back to default root when root param is missing', async () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'statSync').mockReturnValue({ isDirectory: () => true } as any);
    vi.spyOn(fs, 'readdirSync').mockReturnValue([] as any);

    const res = await GET(makeRequest());
    expect(res.status).toBe(200);
  });
});
