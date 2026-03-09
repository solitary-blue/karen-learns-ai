'use client';

import { useEffect, useState, Suspense } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTheme } from 'next-themes';
import SlideShow from '@/components/SlideShow';
import type { LessonResponse, LessonListingResponse, Slide, ClientCurriculumRoot } from '@/lib/types';
import type { LessonMetadata } from '@/lib/frontmatter';

interface LessonLoaderProps {
  rootId: string;
  curriculumRoots: ClientCurriculumRoot[];
}

const DEFAULT_LESSON_SLUG = '00_roadmap_KAREN';

async function fetchLesson(
  slug: string,
  rootId: string,
  resolvedTheme: string | undefined,
  signal: AbortSignal
) {
  const params = new URLSearchParams();
  if (resolvedTheme) params.set('theme', resolvedTheme);
  params.set('root', rootId);

  return fetch(`/api/lessons/${slug}?${params.toString()}`, {
    signal,
  });
}

async function findFirstAvailableLessonSlug(rootId: string, signal: AbortSignal): Promise<string | null> {
  const visitedFolders = new Set<string>();
  const pendingFolders: string[] = [''];

  while (pendingFolders.length > 0) {
    const folder = pendingFolders.shift();
    if (folder === undefined || visitedFolders.has(folder)) {
      continue;
    }

    visitedFolders.add(folder);

    const listingRes = await fetch(`/api/lessons?folder=${encodeURIComponent(folder)}&root=${encodeURIComponent(rootId)}`, {
      signal,
    });

    if (!listingRes.ok) {
      throw new Error('Failed to list lessons');
    }

    const listing: LessonListingResponse = await listingRes.json();
    if (listing.lessons.length > 0) {
      return listing.lessons[0].slug;
    }

    for (const childFolder of listing.folders) {
      if (!visitedFolders.has(childFolder.path)) {
        pendingFolders.push(childFolder.path);
      }
    }
  }

  return null;
}

function replaceWithLesson(pathname: string, router: ReturnType<typeof useRouter>, searchParams: URLSearchParams, slug: string) {
  const nextParams = new URLSearchParams(searchParams.toString());
  nextParams.set('lesson', slug);
  nextParams.delete('slide');
  router.replace(`${pathname}?${nextParams.toString()}`);
}

function LessonLoaderInner({ rootId, curriculumRoots }: LessonLoaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const requestedLesson = searchParams.get('lesson');
  const slug = requestedLesson || DEFAULT_LESSON_SLUG;
  const parsedSlideIndex = Number.parseInt(searchParams.get('slide') || '0', 10);
  const slideIndex = Number.isFinite(parsedSlideIndex) ? parsedSlideIndex : 0;
  const { resolvedTheme } = useTheme();
  const rootLabel = curriculumRoots.find((root) => root.id === rootId)?.label || 'This curriculum';
  
  const [slides, setSlides] = useState<Slide[]>([]);
  const [metadata, setMetadata] = useState<LessonMetadata>({});
  const [error, setError] = useState<string | null>(null);
  const [isEmptyRoot, setIsEmptyRoot] = useState(false);
  const [resolvedSlug, setResolvedSlug] = useState(slug);

  useEffect(() => {
    setResolvedSlug(slug);
  }, [slug]);

  useEffect(() => {
    const abortController = new AbortController();
    const currentSearchParams = new URLSearchParams(searchParams.toString());

    async function loadLesson() {
      setError(null);
      setIsEmptyRoot(false);

      try {
        let activeSlug = slug;
        let res = await fetchLesson(activeSlug, rootId, resolvedTheme, abortController.signal);

        if (!res.ok && res.status === 404 && !requestedLesson) {
          const fallbackSlug = await findFirstAvailableLessonSlug(rootId, abortController.signal);

          if (!fallbackSlug) {
            setSlides([]);
            setMetadata({});
            setResolvedSlug(slug);
            setIsEmptyRoot(true);
            return;
          }

          activeSlug = fallbackSlug;
          res = await fetchLesson(activeSlug, rootId, resolvedTheme, abortController.signal);
        }

        if (!res.ok) {
          throw new Error('Failed to load lesson');
        }

        const data: LessonResponse = await res.json();
        setSlides(data.slides);
        setMetadata(data.metadata || {});
        setResolvedSlug(activeSlug);
        setError(null);

        if (!requestedLesson && activeSlug !== slug) {
          replaceWithLesson(pathname, router, currentSearchParams, activeSlug);
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }

        setSlides([]);
        setMetadata({});
        setResolvedSlug(slug);
        setIsEmptyRoot(false);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    }

    loadLesson();

    return () => {
      abortController.abort();
    };
  }, [slug, resolvedTheme, rootId, requestedLesson, pathname, router, searchParams]);

  if (isEmptyRoot) return (
    <div className="flex h-screen items-center justify-center bg-background px-6">
      <div className="max-w-xl text-center">
        <h1 className="text-3xl font-serif text-primary mb-4">No lessons available yet</h1>
        <p className="text-foreground/60">
          {rootLabel} does not have a starter lesson yet. Switch curricula or add the first lesson when you are ready.
        </p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-2xl font-serif text-destructive mb-4">Oops!</h1>
        <p className="text-foreground/60">{error}</p>
      </div>
    </div>
  );

  if (slides.length === 0) return (
    <div className="flex h-screen items-center justify-center bg-background">
      <p className="animate-pulse font-serif text-primary">Preparing the environment...</p>
    </div>
  );

  return (
    <SlideShow
      key={`${rootId}:${resolvedSlug}:${slideIndex}`}
      slides={slides}
      metadata={metadata}
      currentSlug={resolvedSlug}
      initialSlide={slideIndex}
      rootId={rootId}
      curriculumRoots={curriculumRoots}
    />
  );
}

export default function LessonLoader({ rootId, curriculumRoots }: LessonLoaderProps) {
  return (
    <Suspense fallback={null}>
      <LessonLoaderInner rootId={rootId} curriculumRoots={curriculumRoots} />
    </Suspense>
  );
}
