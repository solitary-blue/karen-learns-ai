import { describe, expect, it, vi, beforeEach } from 'vitest';
import fs from 'fs';

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
}));

import { GET } from './route';

function makeRequest(imagePath: string, root?: string): Request {
  const url = new URL(`http://localhost:3000/api/curriculum-images/${imagePath}`);
  if (root) url.searchParams.set('root', root);
  return new Request(url.toString());
}

function makeParams(pathParts: string[]) {
  return { params: Promise.resolve({ path: pathParts }) };
}

describe('GET /api/curriculum-images/[...path]', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('returns 400 for path traversal attempts', async () => {
    const res = await GET(makeRequest('../etc/passwd'), makeParams(['../etc', 'passwd']));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('Invalid path');
  });

  it('returns 400 for unsupported file types', async () => {
    const res = await GET(makeRequest('document.pdf'), makeParams(['document.pdf']));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('Unsupported file type');
  });

  it('returns 404 when image does not exist', async () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(false);

    const res = await GET(makeRequest('missing.png'), makeParams(['missing.png']));
    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toContain('not found');
  });

  it('returns image with correct content type for valid image', async () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValue(Buffer.from('fake image data'));

    const res = await GET(makeRequest('test.png'), makeParams(['test.png']));
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('image/png');
  });

  it('uses root query param to select curriculum directory', async () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValue(Buffer.from('workspace image'));

    const res = await GET(makeRequest('workspace-img.png', 'workspace'), makeParams(['workspace-img.png']));
    expect(res.status).toBe(200);
  });

  it('returns 400 for invalid root id', async () => {
    const res = await GET(makeRequest('test.png', 'invalid'), makeParams(['test.png']));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('Invalid root');
  });

  it('falls back to default root when root param is missing', async () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValue(Buffer.from('default image'));

    const res = await GET(makeRequest('default.png'), makeParams(['default.png']));
    expect(res.status).toBe(200);
  });

  it('handles nested image paths', async () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValue(Buffer.from('nested image'));

    const res = await GET(makeRequest('01_basics/images/diagram.png'), makeParams(['01_basics', 'images', 'diagram.png']));
    expect(res.status).toBe(200);
  });
});
