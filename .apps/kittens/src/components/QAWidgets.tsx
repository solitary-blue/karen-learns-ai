'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  HelpCircle, ChevronRight, Check,
  MessageCircle, Send, Sparkles,
} from 'lucide-react';
import type { QAItem } from '@/lib/types';

// ─── Shared ─────────────────────────────────────────────────────────────────

interface QAProps {
  title: string;
  items: QAItem[];
}

// ─── Callout Q&A ────────────────────────────────────────────────────────────
// Question callout with embedded answer input. Type → Enter → answer revealed.

export function QACallout({ title, items }: QAProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const handleSubmit = (index: number) => {
    if (!answers[index]?.trim()) return;
    setSubmitted((s) => ({ ...s, [index]: true }));
    setTimeout(() => setRevealed((r) => ({ ...r, [index]: true })), 400);
  };

  return (
    <div className="not-prose text-left my-6 space-y-4">
      <div className="flex items-center gap-2 font-bold text-amber-800">
        <HelpCircle size={20} className="text-amber-600 shrink-0" />
        <span>{title}</span>
      </div>

      {items.map((q, i) => (
        <div
          key={i}
          className="rounded-lg border border-amber-300/40 bg-amber-50/60 overflow-hidden"
        >
          <div className="px-4 pt-3 pb-1 text-[15px] leading-relaxed text-amber-950">
            {q.question}
          </div>

          <div className="px-4 pb-4 pt-2">
            <AnimatePresence mode="wait">
              {!submitted[i] ? (
                <motion.div
                  key="input"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="relative"
                >
                  <input
                    type="text"
                    placeholder="Type your answer..."
                    value={answers[i] || ''}
                    onChange={(e) => setAnswers((a) => ({ ...a, [i]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit(i)}
                    className="w-full px-3 py-2 pr-10 rounded-md border border-amber-300/50 bg-white/80 text-sm text-amber-950 placeholder:text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400"
                  />
                  <button
                    onClick={() => handleSubmit(i)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-amber-500 hover:text-amber-700 transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="submitted"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-3"
                >
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center shrink-0">
                      <Check size={12} className="text-amber-700" />
                    </div>
                    <p className="text-sm text-amber-900 italic">{answers[i]}</p>
                  </div>

                  <AnimatePresence>
                    {revealed[i] && q.answer && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-amber-300/30 pt-3 mt-1">
                          <p className="text-xs font-semibold uppercase tracking-wider text-amber-600 mb-1">
                            Model Answer
                          </p>
                          <p className="text-sm text-amber-950 leading-relaxed">
                            {q.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Quiz Bullets ───────────────────────────────────────────────────────────
// Bullet list with inline answer input → reveal nested answer.

export function QABullets({ title, items }: QAProps) {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [locked, setLocked] = useState<Record<number, boolean>>({});

  const lockAndReveal = (i: number) => {
    if (!userAnswers[i]?.trim()) return;
    setLocked((l) => ({ ...l, [i]: true }));
    setExpanded((e) => ({ ...e, [i]: true }));
  };

  const toggle = (i: number) => {
    if (!locked[i] && userAnswers[i]?.trim()) {
      setLocked((l) => ({ ...l, [i]: true }));
    }
    if (locked[i]) {
      setExpanded((e) => ({ ...e, [i]: !e[i] }));
    }
  };

  return (
    <div className="not-prose text-left my-6 space-y-1">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg font-serif font-bold text-slate-800">{title}</span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700 border border-violet-200">
          #quiz
        </span>
      </div>

      {items.map((q, i) => (
        <div key={i} className="group">
          <div className="flex items-start gap-3">
            <button
              onClick={() => toggle(i)}
              className="mt-1 shrink-0 text-violet-500 hover:text-violet-700 transition-colors"
            >
              <motion.div
                animate={{ rotate: expanded[i] ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight size={18} />
              </motion.div>
            </button>

            <div className="flex-1 min-w-0">
              <button
                onClick={() => toggle(i)}
                className="text-left text-[15px] leading-relaxed text-slate-800 hover:text-violet-800 transition-colors"
              >
                {q.question}
              </button>

              {!locked[i] && (
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Your answer..."
                    value={userAnswers[i] || ''}
                    onChange={(e) => setUserAnswers((a) => ({ ...a, [i]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && lockAndReveal(i)}
                    className="flex-1 px-3 py-1.5 rounded border border-violet-200 bg-violet-50/50 text-sm text-slate-700 placeholder:text-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-300/40 focus:border-violet-400"
                  />
                  <button
                    onClick={() => lockAndReveal(i)}
                    className="px-3 py-1.5 rounded bg-violet-100 text-violet-600 text-xs font-medium hover:bg-violet-200 transition-colors"
                  >
                    Reveal
                  </button>
                </div>
              )}

              <AnimatePresence>
                {expanded[i] && locked[i] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 ml-1 pl-4 border-l-2 border-violet-200 space-y-2">
                      <p className="text-sm text-slate-500 italic">
                        You said: &ldquo;{userAnswers[i]}&rdquo;
                      </p>
                      {q.answer && (
                        <p className="text-sm text-violet-900 leading-relaxed">
                          {q.answer}
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Kitten Chat ────────────────────────────────────────────────────────────
// Conversational Q&A — questions as speech bubbles, user replies, model answer revealed.

export function QAChat({ title, items }: QAProps) {
  const [currentQ, setCurrentQ] = useState(0);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<
    { role: 'kitten' | 'karen' | 'reveal'; text: string }[]
  >([{ role: 'kitten', text: items[0]?.question || '' }]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    const userText = input.trim();
    setInput('');

    setMessages((m) => [...m, { role: 'karen', text: userText }]);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((m) => [
        ...m,
        { role: 'reveal', text: items[currentQ]?.answer || '' },
      ]);

      const nextQ = currentQ + 1;
      if (nextQ < items.length) {
        setTimeout(() => {
          setCurrentQ(nextQ);
          setMessages((m) => [...m, { role: 'kitten', text: items[nextQ].question }]);
        }, 800);
      }
    }, 1200);
  };

  const allDone =
    currentQ >= items.length - 1 &&
    messages.some(
      (m) => m.role === 'reveal' && m.text === items[items.length - 1]?.answer
    );

  return (
    <div className="not-prose text-left my-6 flex flex-col h-[520px] rounded-xl border border-teal-200 bg-gradient-to-b from-teal-50/40 to-white overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-teal-50 border-b border-teal-200/60">
        <div className="w-8 h-8 rounded-full bg-teal-200 flex items-center justify-center overflow-hidden">
          <img src="/api/kittens/shows-book" alt="" className="w-7 h-7 object-contain" />
        </div>
        <div>
          <p className="text-sm font-semibold text-teal-900">{title}</p>
          <p className="text-[10px] text-teal-500 uppercase tracking-wider">
            {items.length} question{items.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Sparkles size={16} className="ml-auto text-teal-400" />
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={cn('flex', msg.role === 'karen' ? 'justify-end' : 'justify-start')}
            >
              {msg.role === 'kitten' && (
                <div className="max-w-[80%] flex items-end gap-2">
                  <MessageCircle size={16} className="text-teal-400 shrink-0 mb-1" />
                  <div className="rounded-2xl rounded-bl-md px-4 py-2.5 bg-white border border-teal-200/60 shadow-sm">
                    <p className="text-sm text-slate-800 leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              )}
              {msg.role === 'karen' && (
                <div className="max-w-[80%]">
                  <div className="rounded-2xl rounded-br-md px-4 py-2.5 bg-teal-600 text-white shadow-sm">
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              )}
              {msg.role === 'reveal' && (
                <div className="max-w-[80%] flex items-end gap-2">
                  <Sparkles size={14} className="text-amber-400 shrink-0 mb-1" />
                  <div className="rounded-2xl rounded-bl-md px-4 py-2.5 bg-amber-50 border border-amber-200/60 shadow-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-500 mb-1">
                      Model Answer
                    </p>
                    <p className="text-sm text-amber-900 leading-relaxed">{msg.text}</p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <MessageCircle size={16} className="text-teal-400" />
              <div className="rounded-2xl px-4 py-2 bg-white border border-teal-200/60">
                <div className="flex gap-1">
                  {[0, 1, 2].map((dot) => (
                    <motion.div
                      key={dot}
                      className="w-1.5 h-1.5 rounded-full bg-teal-400"
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: dot * 0.15 }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {allDone && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center py-4"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-teal-500">
              All questions complete!
            </p>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-teal-100">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder={allDone ? 'All done!' : 'Type your answer...'}
            value={input}
            disabled={allDone || isTyping}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 px-3 py-2 rounded-full border border-teal-200 bg-teal-50/30 text-sm text-slate-700 placeholder:text-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-300/40 focus:border-teal-400 disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={allDone || isTyping || !input.trim()}
            className="p-2 rounded-full bg-teal-600 text-white hover:bg-teal-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
