import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import LessonLoader from './LessonLoader';

expect.extend(matchers);

let currentSearchParams = new URLSearchParams();
const fetchMock = vi.fn();

vi.mock('next/navigation', () => ({
  useSearchParams: () => currentSearchParams,
}));

vi.mock('next-themes', () => ({
  useTheme: () => ({ resolvedTheme: 'montessori' }),
}));

vi.mock('@/components/SlideShow', () => ({
  default: ({ currentSlug }: { currentSlug: string }) => <div data-testid="slideshow">{currentSlug}</div>,
}));

beforeEach(() => {
  currentSearchParams = new URLSearchParams();
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('LessonLoader', () => {
  it('shows an empty state when the default lesson is missing for a curriculum root', async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ error: 'Lesson not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    );

    render(
      <LessonLoader
        rootId="workspace"
        curriculumRoots={[{ id: 'workspace', label: 'Workspace', pathSegments: ['workspace'] }]}
      />
    );

    expect(await screen.findByText('No lessons available yet')).toBeInTheDocument();
    expect(screen.getByText(/Workspace does not have a starter lesson yet/i)).toBeInTheDocument();
  });

  it('renders the slideshow when a lesson loads successfully', async () => {
    currentSearchParams = new URLSearchParams('lesson=custom_lesson');
    fetchMock.mockResolvedValue(
      new Response(
        JSON.stringify({
          slides: [{ title: 'Loaded', html: '<p>Loaded</p>', hideTitle: false }],
          metadata: { title: 'Loaded Lesson' },
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );

    render(
      <LessonLoader
        rootId="current"
        curriculumRoots={[{ id: 'current', label: 'Karen Learns AI', pathSegments: [''] }]}
      />
    );

    expect(await screen.findByTestId('slideshow')).toHaveTextContent('custom_lesson');
  });
});
