import { describe, expect, it, vi, beforeEach } from 'vitest';
import fs from 'fs';
import { TEST_CALLOUT_CONFIG, SIMPLE_LESSON } from '@/test/fixtures';

vi.mock('@/lib/callout-config', () => ({
  loadCalloutConfig: () => TEST_CALLOUT_CONFIG,
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
}));

const mockParseMarkdownToSlides = vi.fn().mockResolvedValue([]);

vi.mock('@/lib/markdown', () => ({
  parseMarkdownToSlides: (...args: any[]) => mockParseMarkdownToSlides(...args),
}));

import { GET } from './route';

function makeRequest(slug: string): Request {
  return new Request(`http://localhost:3000/api/lessons/${slug}`);
}

function makeParams(slug: string) {
  return { params: Promise.resolve({ slug: slug.split('/') }) };
}

describe('GET /api/lessons/[slug]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('returns 400 for invalid slug (path traversal)', async () => {
    const res = await GET(makeRequest('../etc/passwd'), makeParams('../etc/passwd'));

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('Invalid');
  });

  it('returns 404 for nonexistent file', async () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(false);

    const res = await GET(makeRequest('no-such-lesson'), makeParams('no-such-lesson'));

    expect(res.status).toBe(404);
    const body = await res.json();
    expect(body.error).toContain('not found');
  });

  it('returns 200 with parsed metadata and slides for valid lesson', async () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValue(SIMPLE_LESSON);
    
    mockParseMarkdownToSlides.mockResolvedValueOnce([
      { title: 'Slide One', html: '<p>Content</p>' },
      { title: 'Slide Two', html: '<p>More</p>' }
    ]);

    const res = await GET(makeRequest('cosmic-education'), makeParams('cosmic-education'));

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.metadata.title).toBe('Cosmic Education');
    expect(body.slides).toHaveLength(2);
    expect(body.slides[0].title).toBe('Slide One');
    expect(body.slides[1].title).toBe('Slide Two');
  });

  it('accepts slugs with hyphens, underscores, and numbers', async () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValue('# Test\n\nContent');

    const res = await GET(makeRequest('lesson-01_test'), makeParams('lesson-01_test'));

    expect(res.status).toBe(200);
  });

  it('passes theme query parameter to markdown parser', async () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValue('# Theme Test');
    
    const req = new Request('http://localhost:3000/api/lessons/test-theme?theme=dracula');
    const res = await GET(req, makeParams('test-theme'));
    
    expect(res.status).toBe(200);
    expect(mockParseMarkdownToSlides).toHaveBeenCalledWith('# Theme Test', 'dracula', 'test-theme', 'current');
  });

  it('passes root query parameter to curriculum directory resolver', async () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValue('# Root Test');
    
    const req = new Request('http://localhost:3000/api/lessons/test-root?root=workspace');
    const res = await GET(req, makeParams('test-root'));
    
    expect(res.status).toBe(200);
    expect(mockParseMarkdownToSlides).toHaveBeenCalledWith('# Root Test', undefined, 'test-root', 'workspace');
  });

  it('returns 400 for invalid root id', async () => {
    const req = new Request('http://localhost:3000/api/lessons/test?root=invalid');
    const res = await GET(req, makeParams('test'));
    
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain('Invalid root');
  });

  it('falls back to default root when root param is missing', async () => {
    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValue('# Default Root Test');
    
    const req = new Request('http://localhost:3000/api/lessons/test-default');
    const res = await GET(req, makeParams('test-default'));
    
    expect(res.status).toBe(200);
    expect(mockParseMarkdownToSlides).toHaveBeenCalledWith('# Default Root Test', undefined, 'test-default', 'current');
  });
});
