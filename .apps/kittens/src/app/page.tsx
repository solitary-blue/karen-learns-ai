'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from 'next-themes';
import SlideShow from '@/components/SlideShow';
import type { LessonResponse, Slide } from '@/lib/types';
import type { LessonMetadata } from '@/lib/frontmatter';

function LessonLoader() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('lesson') || '01_basics/00_karen-learns-ai-roadmap';
  const slideIndex = parseInt(searchParams.get('slide') || '0', 10);
  const { resolvedTheme } = useTheme();
  
  const [slides, setSlides] = useState<Slide[]>([]);
  const [metadata, setMetadata] = useState<LessonMetadata>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLesson() {
      try {
        const themeQuery = resolvedTheme ? `?theme=${resolvedTheme}` : '';
        const res = await fetch(`/api/lessons/${slug}${themeQuery}`);
        if (!res.ok) throw new Error('Failed to load lesson');
        const data: LessonResponse = await res.json();
        setSlides(data.slides);
        setMetadata(data.metadata || {});
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    }
    loadLesson();
  }, [slug, resolvedTheme]);

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

  return <SlideShow slides={slides} metadata={metadata} currentSlug={slug} initialSlide={slideIndex} />;
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <LessonLoader />
    </Suspense>
  );
}
