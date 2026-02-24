'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SlideShow from '@/components/SlideShow';
import type { LessonResponse, Slide } from '@/lib/types';
import type { LessonMetadata } from '@/lib/frontmatter';

function LessonLoader() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('lesson') || '03_llm_memory_KAREN';
  const [slides, setSlides] = useState<Slide[]>([]);
  const [metadata, setMetadata] = useState<LessonMetadata>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadLesson() {
      try {
        const res = await fetch(`/api/lessons/${slug}`);
        if (!res.ok) throw new Error('Failed to load lesson');
        const data: LessonResponse = await res.json();
        setSlides(data.slides);
        setMetadata(data.metadata || {});
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    }
    loadLesson();
  }, [slug]);

  if (error) return (
    <div className="flex h-screen items-center justify-center bg-montessori-cream">
      <div className="text-center">
        <h1 className="text-2xl font-serif text-red-800 mb-4">Oops!</h1>
        <p className="text-montessori-charcoal/60">{error}</p>
      </div>
    </div>
  );

  if (slides.length === 0) return (
    <div className="flex h-screen items-center justify-center bg-montessori-cream">
      <p className="animate-pulse font-serif text-montessori-gold">Preparing the environment...</p>
    </div>
  );

  return <SlideShow slides={slides} metadata={metadata} />;
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <LessonLoader />
    </Suspense>
  );
}
