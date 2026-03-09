import React from 'react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import SlideShow from './SlideShow';

expect.extend(matchers);

const pushMock = vi.fn();
const fetchMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => '/',
}));

vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    img: () => <div data-testid="motion-image" />,
  },
}));

vi.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DropdownMenuItem: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
}));

vi.mock('./SlideContent', () => ({
  default: ({ html }: { html: string }) => <div data-testid="slide-html">{html}</div>,
}));

beforeEach(() => {
  fetchMock.mockReset();
  fetchMock.mockImplementation(async () =>
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
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  cleanup();
  pushMock.mockReset();
  vi.unstubAllGlobals();
});

describe('SlideShow', () => {
  it('resets to a safe slide when the lesson changes', () => {
    const { rerender } = render(
      <SlideShow
        slides={[
          { title: 'Lesson A 1', html: 'lesson-a-1', hideTitle: false },
          { title: 'Lesson A 2', html: 'lesson-a-2', hideTitle: false },
        ]}
        currentSlug="lesson-a"
        initialSlide={1}
        rootId="current"
        curriculumRoots={[]}
      />
    );

    expect(screen.getByTestId('slide-html')).toHaveTextContent('lesson-a-2');

    rerender(
      <SlideShow
        slides={[{ title: 'Lesson B 1', html: 'lesson-b-1', hideTitle: false }]}
        currentSlug="lesson-b"
        initialSlide={0}
        rootId="current"
        curriculumRoots={[]}
      />
    );

    expect(screen.getByTestId('slide-html')).toHaveTextContent('lesson-b-1');
    expect(screen.getByText('1 / 1')).toBeInTheDocument();
  });
});
