import React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import LessonLoader from './LessonLoader';

expect.extend(matchers);

let currentSearchParams = new URLSearchParams();
const fetchMock = vi.fn();
const replaceMock = vi.fn();

vi.mock('next/navigation', () => ({
  useSearchParams: () => currentSearchParams,
  useRouter: () => ({ replace: replaceMock }),
  usePathname: () => '/workspace',
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
  replaceMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('LessonLoader', () => {
  it('loads the first available lesson when the default lesson is missing for a curriculum root', async () => {
    fetchMock.mockImplementation((input: string | URL | Request) => {
      const url = String(input);

      if (url.includes('/api/lessons/00_roadmap_KAREN')) {
        return Promise.resolve(
          new Response(JSON.stringify({ error: 'Lesson not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      }

      if (url.includes('/api/lessons?')) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              lessons: [{ slug: '01-kitten-fun-facts', title: 'Kitten Fun Facts', label: 'Kitten Fun Facts' }],
              folders: [],
              currentPath: '',
              parentPath: null,
              parentLabel: null,
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        );
      }

      if (url.includes('/api/lessons/01-kitten-fun-facts')) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              slides: [{ title: 'Loaded', html: '<p>Loaded</p>', hideTitle: false }],
              metadata: { title: 'Kitten Fun Facts' },
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        );
      }

      throw new Error(`Unexpected fetch: ${url}`);
    });

    render(
      <LessonLoader
        rootId="workspace"
        curriculumRoots={[{ id: 'workspace', label: 'Workspace', pathSegments: ['workspace'] }]}
      />
    );

    expect(await screen.findByTestId('slideshow')).toHaveTextContent('01-kitten-fun-facts');
    expect(replaceMock).toHaveBeenCalledWith('/workspace?lesson=01-kitten-fun-facts');
  });

  it('traverses sibling folders when resolving a fallback lesson slug', async () => {
    fetchMock.mockImplementation((input: string | URL | Request) => {
      const url = new URL(String(input), 'http://localhost');

      if (url.pathname.includes('/api/lessons/00_roadmap_KAREN')) {
        return Promise.resolve(
          new Response(JSON.stringify({ error: 'Lesson not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      }

      if (url.pathname === '/api/lessons') {
        const folder = url.searchParams.get('folder') || '';

        if (folder === '') {
          return Promise.resolve(
            new Response(
              JSON.stringify({
                lessons: [],
                folders: [
                  { name: '01_empty_branch', label: 'Empty Branch', path: '01_empty_branch' },
                  { name: '02_filled_branch', label: 'Filled Branch', path: '02_filled_branch' },
                ],
                currentPath: '',
                parentPath: null,
                parentLabel: null,
              }),
              {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          );
        }

        if (folder === '01_empty_branch') {
          return Promise.resolve(
            new Response(
              JSON.stringify({
                lessons: [],
                folders: [],
                currentPath: '01_empty_branch',
                parentPath: '',
                parentLabel: 'Curriculum',
              }),
              {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          );
        }

        if (folder === '02_filled_branch') {
          return Promise.resolve(
            new Response(
              JSON.stringify({
                lessons: [
                  {
                    slug: '02_filled_branch/01_intro',
                    title: 'Intro',
                    label: 'Intro',
                  },
                ],
                folders: [],
                currentPath: '02_filled_branch',
                parentPath: '',
                parentLabel: 'Curriculum',
              }),
              {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
              }
            )
          );
        }
      }

      if (url.pathname.includes('/api/lessons/02_filled_branch/01_intro')) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              slides: [{ title: 'Loaded', html: '<p>Loaded</p>', hideTitle: false }],
              metadata: { title: 'Intro' },
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        );
      }

      throw new Error(`Unexpected fetch: ${url.toString()}`);
    });

    render(
      <LessonLoader
        rootId="workspace"
        curriculumRoots={[{ id: 'workspace', label: 'Workspace', pathSegments: ['workspace'] }]}
      />
    );

    expect(await screen.findByTestId('slideshow')).toHaveTextContent('02_filled_branch/01_intro');
    expect(replaceMock).toHaveBeenCalledWith('/workspace?lesson=02_filled_branch%2F01_intro');
  });

  it('shows an empty state when the selected curriculum root has no lessons at all', async () => {
    fetchMock.mockImplementation((input: string | URL | Request) => {
      const url = String(input);

      if (url.includes('/api/lessons/00_roadmap_KAREN')) {
        return Promise.resolve(
          new Response(JSON.stringify({ error: 'Lesson not found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          })
        );
      }

      if (url.includes('/api/lessons?')) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              lessons: [],
              folders: [],
              currentPath: '',
              parentPath: null,
              parentLabel: null,
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        );
      }

      throw new Error(`Unexpected fetch: ${url}`);
    });

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
