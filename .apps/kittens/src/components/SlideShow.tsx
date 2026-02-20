'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import type { Slide } from '@/lib/types';

interface SlideShowProps {
  slides: Slide[];
}

export default function SlideShow({ slides }: SlideShowProps) {
  const [current, setCurrent] = useState(0);
  const [showList, setShowList] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev < slides.length - 1 ? prev + 1 : prev));
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev();
      if (e.key === 'Escape') setShowList(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [next, prev]);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-background select-none">
      {/* Ghost UI: Slide List Button */}
      <div className="absolute top-6 left-6 z-50 opacity-0 hover:opacity-100 transition-opacity">
        <button
          onClick={() => setShowList(true)}
          className="p-2 rounded-full hover:bg-black/5 text-foreground/40 hover:text-foreground transition-colors"
        >
          <List size={24} />
        </button>
      </div>

      {/* Ghost UI: Navigation Hovers */}
      <div
        className="absolute top-0 left-0 right-0 h-24 z-40 group flex items-center justify-center cursor-pointer"
        onClick={prev}
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
        onClick={next}
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

      {/* Slide List Sidebar — shadcn Sheet */}
      <Sheet open={showList} onOpenChange={setShowList}>
        <SheetContent side="left" className="w-80 overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="text-2xl font-serif text-primary">
              Lesson Overview
            </SheetTitle>
          </SheetHeader>
          <div className="space-y-4 mt-6">
            {slides.map((slide, i) => (
              <button
                key={i}
                aria-current={current === i ? 'page' : undefined}
                onClick={() => {
                  setCurrent(i);
                  setShowList(false);
                }}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-colors text-sm font-medium",
                  current === i
                    ? "bg-muted text-primary border border-primary/20"
                    : "hover:bg-muted/50 text-muted-foreground"
                )}
              >
                {slide.title}
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Progress Dot */}
      <div className="absolute bottom-8 right-8 text-[10px] tracking-[0.2em] font-medium text-primary/30 uppercase">
        {current + 1} / {slides.length}
      </div>
    </div>
  );
}
