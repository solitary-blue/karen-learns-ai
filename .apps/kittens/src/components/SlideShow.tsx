'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, ChevronLeft, ChevronRight, Folder, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import type { Slide, LessonListingResponse } from '@/lib/types';
import type { LessonMetadata, LessonMetadataValue } from '@/lib/frontmatter';
import { useRouter } from 'next/navigation';

interface SlideShowProps {
  slides: Slide[];
  metadata?: LessonMetadata;
  currentSlug: string;
}

type MenuMode = 'overview' | 'curriculum';

function formatMetadataValue(value: LessonMetadataValue): string {
  if (Array.isArray(value)) {
    return value
      .map((item) => formatMetadataValue(item))
      .filter(Boolean)
      .join(', ');
  }

  if (value === null) {
    return 'null';
  }

  return String(value);
}

function humanizeMetadataKey(key: string): string {
  return key
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatFolderName(name: string): string {
  return name
    .replace(/^\d{2}_/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
}

export default function SlideShow({ slides, metadata = {}, currentSlug }: SlideShowProps) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [showList, setShowList] = useState(false);
  const [menuMode, setMenuMode] = useState<MenuMode>('overview');
  const [listing, setListing] = useState<LessonListingResponse | null>(null);
  const [currentFolder, setCurrentFolder] = useState<string>('');

  const metadataEntries = Object.entries(metadata).filter(([, value]) => {
    const formatted = formatMetadataValue(value);
    return formatted.trim().length > 0;
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        setCurrent((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        setCurrent((prev) => (prev > 0 ? prev - 1 : prev));
      }
      if (e.key === 'Escape') setShowList(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length]);

  useEffect(() => {
    // Initial load of the listing for the current lesson's folder
    const folder = currentSlug.includes('/') 
      ? currentSlug.split('/').slice(0, -1).join('/')
      : '';
    fetchListing(folder);
  }, [currentSlug]);

  const fetchListing = async (folder: string) => {
    try {
      const res = await fetch(`/api/lessons?folder=${encodeURIComponent(folder)}`);
      if (res.ok) {
        const data = await res.json();
        setListing(data);
        setCurrentFolder(folder);
      }
    } catch (e) {
      console.error('Failed to fetch listing', e);
    }
  };

  const navigateToLesson = (slug: string) => {
    setShowList(false);
    router.push(`/?lesson=${slug}`);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background select-none">
      {/* Ghost UI: Slide List Button */}
      <div className="absolute top-6 left-6 z-50 opacity-0 hover:opacity-100 transition-opacity">
        <button
          onClick={() => {
            setMenuMode('overview');
            setShowList(true);
          }}
          className="p-2 rounded-full hover:bg-black/5 text-foreground/40 hover:text-foreground transition-colors"
        >
          <List size={24} />
        </button>
      </div>

      {/* Ghost UI: Navigation Hovers */}
      <div
        className="absolute top-0 left-0 right-0 h-24 z-40 group flex items-center justify-center cursor-pointer"
        onClick={() => setCurrent((prev) => (prev > 0 ? prev - 1 : prev))}
      >
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest text-primary/60 mb-1">Previous</span>
          <span className="text-sm font-serif text-foreground/40">
            {current > 0 ? slides[current - 1].title : 'Start of Lesson'}
          </span>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-24 z-40 group flex items-center justify-center cursor-pointer"
        onClick={() => setCurrent((prev) => (prev < slides.length - 1 ? prev + 1 : prev))}
      >
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center">
          <span className="text-sm font-serif text-foreground/40 mb-1">
            {current < slides.length - 1 ? slides[current + 1].title : 'End of Lesson'}
          </span>
          <span className="text-xs uppercase tracking-widest text-primary/60">Next</span>
        </div>
      </div>

      {/* Slide Content */}
      <div className="absolute inset-0 flex items-center justify-center p-12 md:p-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="prose prose-lg md:prose-2xl max-w-4xl w-full mx-auto text-center"
          >
             <div dangerouslySetInnerHTML={{ __html: slides[current].html }} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Kitten Mascot */}
      <AnimatePresence mode="wait">
        {slides[current].kitten && (
          <motion.img
            key={`kitten-${current}`}
            src={`/api/kittens/${slides[current].kitten!.name}`}
            alt=""
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
            className="absolute bottom-28 right-8 z-30 pointer-events-none"
            style={{ height: slides[current].kitten!.height, width: 'auto' }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar — Curriculum & TOC */}
      <Sheet open={showList} onOpenChange={setShowList}>
        <SheetContent side="left" className="w-80 p-0 flex flex-col overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            {menuMode === 'overview' ? (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col h-full overflow-hidden"
              >
                <div className="p-6 border-b border-border bg-background">
                  <button 
                    onClick={() => setMenuMode('curriculum')}
                    className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors group mb-3"
                  >
                    <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    <span>{currentFolder ? formatFolderName(currentFolder.split('/').pop() || '') : 'Curriculum'}</span>
                  </button>
                  <SheetTitle className="text-xl font-serif text-primary leading-tight">
                    {(metadata.title as string) || (currentSlug.split('/').pop() ? formatFolderName(currentSlug.split('/').pop()!) : currentSlug)}
                  </SheetTitle>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-1">
                  {metadataEntries.length > 0 && (
                    <section className="rounded-lg border border-primary/10 bg-primary/5 p-3 mb-4">
                      <h3 className="font-serif text-[10px] uppercase tracking-wider text-primary/80">Lesson Details</h3>
                      <dl className="mt-2 space-y-1">
                        {metadataEntries.map(([key, value]) => (
                          <div key={key}>
                            <dt className="text-[9px] uppercase tracking-wider text-muted-foreground">{humanizeMetadataKey(key)}</dt>
                            <dd className="text-xs text-foreground/90 font-medium">{formatMetadataValue(value)}</dd>
                          </div>
                        ))}
                      </dl>
                    </section>
                  )}

                  {slides.map((slide, i) => (
                    <button
                      key={i}
                      aria-current={current === i ? 'page' : undefined}
                      onClick={() => {
                        setCurrent(i);
                        setShowList(false);
                      }}
                      className={cn(
                        "w-full text-left p-2 rounded-lg transition-colors text-sm font-medium",
                        current === i
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "hover:bg-muted text-muted-foreground"
                      )}
                    >
                      {i + 1}. {slide.title}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="curriculum"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex-1 flex flex-col h-full overflow-hidden"
              >
                <div className="p-6 border-b border-border bg-background">
                  {listing?.parentPath !== null && (
                    <button 
                      onClick={() => fetchListing(listing!.parentPath!)}
                      className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors group mb-3"
                    >
                      <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                      <span>{listing?.parentLabel || 'Curriculum'}</span>
                    </button>
                  )}
                  <SheetTitle className="text-2xl font-serif text-primary">
                    {currentFolder ? formatFolderName(currentFolder.split('/').pop() || '') : 'Curriculum'}
                  </SheetTitle>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-1">
                  {listing?.folders.map((folder) => (
                    <button
                      key={folder.path}
                      onClick={() => fetchListing(folder.path)}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted text-foreground font-bold text-sm transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Folder size={16} className="text-primary/60" />
                        <span>{folder.label}</span>
                      </div>
                      <ChevronRight size={16} className="text-muted-foreground/40" />
                    </button>
                  ))}

                  {listing?.lessons.map((lesson) => (
                    <button
                      key={lesson.slug}
                      onClick={() => navigateToLesson(lesson.slug)}
                      className={cn(
                        "w-full flex items-center gap-2 p-2 rounded-lg transition-colors text-sm",
                        currentSlug === lesson.slug
                          ? "bg-primary/10 text-primary font-medium border border-primary/20"
                          : "hover:bg-muted text-muted-foreground"
                      )}
                    >
                      <FileText size={14} className={cn(currentSlug === lesson.slug ? "text-primary/60" : "text-muted-foreground/40")} />
                      <span className="truncate">{lesson.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </SheetContent>
      </Sheet>

      {/* Progress Dot */}
      <div className="absolute bottom-8 right-8 text-[10px] tracking-[0.2em] font-medium text-primary/30 uppercase">
        {current + 1} / {slides.length}
      </div>
    </div>
  );
}
