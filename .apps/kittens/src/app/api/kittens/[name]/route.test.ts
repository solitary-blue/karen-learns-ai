import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { NextResponse } from 'next/server';
import fs from 'fs';

vi.mock('@/lib/kitten-config', () => ({
  resolveKitten: vi.fn(),
}));
import { resolveKitten } from '@/lib/kitten-config';

vi.mock('fs');

describe('GET /api/kittens/[name]', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns 400 for invalid name format', async () => {
    const params = Promise.resolve({ name: 'invalid_name!' });
    const response = await GET(new Request('http://localhost'), { params });

    expect(response.status).toBe(400);
  });

  it('returns 404 for unknown name', async () => {
    vi.mocked(resolveKitten).mockReturnValue(null);
    const params = Promise.resolve({ name: 'unknown-cat' });
    const response = await GET(new Request('http://localhost'), { params });

    expect(response.status).toBe(404);
  });

  it('returns 200 with correct headers for valid name', async () => {
    vi.mocked(resolveKitten).mockReturnValue({
      name: 'valid-cat',
      filePath: '/mock/path/kitty-valid-cat.png',
    });
    vi.mocked(fs.readFileSync).mockReturnValue(Buffer.from('fake-image-data'));

    const params = Promise.resolve({ name: 'valid-cat' });
    const response = await GET(new Request('http://localhost'), { params });

    expect(response.status).toBe(200);
    expect(response.headers.get('Content-Type')).toBe('image/png');
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=31536000, immutable');
    
    // In Next.js testing, we can await the response body to verify it
    const body = await response.text();
    expect(body).toBe('fake-image-data');
  });
});