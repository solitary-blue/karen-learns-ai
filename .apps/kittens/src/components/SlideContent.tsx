'use client';

import { useMemo } from 'react';
import type { QABlock } from '@/lib/types';
import { QACallout, QABullets, QAChat } from './QAWidgets';

const QA_MARKER = /<!--qa:(.*?):qa-->/g;

interface SlideContentProps {
  html: string;
}

export default function SlideContent({ html }: SlideContentProps) {
  const segments = useMemo(() => {
    const parts = html.split(QA_MARKER);
    // String.split with a capture group alternates: [html, captured, html, captured, ...]
    if (parts.length === 1) return null; // no QA blocks — fast path

    return parts.map((part, i) => {
      if (i % 2 === 0) return { type: 'html' as const, value: part };
      try {
        return { type: 'qa' as const, block: JSON.parse(part) as QABlock };
      } catch {
        return { type: 'html' as const, value: '' };
      }
    });
  }, [html]);

  // Fast path: no QA blocks, render as plain HTML
  if (!segments) {
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  }

  return (
    <>
      {segments.map((seg, i) => {
        if (seg.type === 'html') {
          return seg.value.trim()
            ? <div key={i} dangerouslySetInnerHTML={{ __html: seg.value }} />
            : null;
        }
        const { block } = seg;
        switch (block.type) {
          case 'callout':
            return <QACallout key={i} title={block.title} items={block.items} />;
          case 'bullets':
            return <QABullets key={i} title={block.title} items={block.items} />;
          case 'chat':
            return <QAChat key={i} title={block.title} items={block.items} />;
          default:
            return null;
        }
      })}
    </>
  );
}
