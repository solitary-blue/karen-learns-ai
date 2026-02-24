import { describe, expect, it, vi } from 'vitest';
import fs from 'fs';
import { TEST_CALLOUT_CONFIG, SIMPLE_LESSON } from '@/test/fixtures';

vi.mock('@/lib/callout-config', () => ({
  loadCalloutConfig: () => TEST_CALLOUT_CONFIG,
}));

import { GET } from './route';

function makeRequest(slug: string): Request {
  return new Request(`http://localhost:3000/api/lessons/${slug}`);
}

function makeParams(slug: string) {
  return { params: Promise.resolve({ slug }) };
}

describe('GET /api/lessons/[slug]', () => {
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
});
