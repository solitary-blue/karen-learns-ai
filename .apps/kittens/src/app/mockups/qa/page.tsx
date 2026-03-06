'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  HelpCircle, ChevronDown, ChevronRight, Check,
  MessageCircle, Send, Sparkles,
} from 'lucide-react';

// ─── Shared data ────────────────────────────────────────────────────────────

const SAMPLE_QUESTIONS = [
  {
    question: "What's the difference between what Claude did when you asked it to create folders, versus what a regular chatbot would have done?",
    answer: "A regular chatbot would have *described* a folder structure in text. Claude actually created the folders and files on your computer — it took action in the real world, not just talked about it.",
  },
  {
    question: "You tried two agents — Claude and Gemini. Did you notice any differences in how they responded?",
    answer: "They have different personalities and styles. One might be more detailed, the other more concise. Neither is better — they're different tools for different moments.",
  },
  {
    question: "What would you type to start a conversation with Claude? What about Gemini?",
    answer: "Type `claude` to start Claude, or `gemini` to start Gemini. Just one word and press Enter!",
  },
];

// ─── Mockup 1: Callout Q&A ─────────────────────────────────────────────────
// Question callout with embedded answer input. Type → Enter → answer revealed.

function CalloutQA() {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState<Record<number, boolean>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const handleSubmit = (index: number) => {
    if (!answers[index]?.trim()) return;
    setSubmitted((s) => ({ ...s, [index]: true }));
    // Short delay before revealing model answer
    setTimeout(() => setRevealed((r) => ({ ...r, [index]: true })), 400);
  };

  return (
    <div className="space-y-6">
      {SAMPLE_QUESTIONS.map((q, i) => (
        <div
          key={i}
          className="rounded-lg border border-amber-300/40 bg-amber-50/60 overflow-hidden"
        >
          {/* Question header */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-100/60 border-b border-amber-300/30 font-semibold text-amber-900 text-sm">
            <HelpCircle size={18} className="text-amber-600 shrink-0" />
            Question {i + 1}
          </div>

          {/* Question body */}
          <div className="px-4 pt-3 pb-1 text-[15px] leading-relaxed text-amber-950">
            {q.question}
          </div>

          {/* Answer area */}
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
                    onChange={(e) =>
                      setAnswers((a) => ({ ...a, [i]: e.target.value }))
                    }
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
                  {/* Karen's answer as text */}
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-amber-200 flex items-center justify-center shrink-0">
                      <Check size={12} className="text-amber-700" />
                    </div>
                    <p className="text-sm text-amber-900 italic">
                      {answers[i]}
                    </p>
                  </div>

                  {/* Model answer */}
                  <AnimatePresence>
                    {revealed[i] && (
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

// ─── Mockup 2: Quiz Bullets ─────────────────────────────────────────────────
// Bullet list tagged #quiz. Click to expand answers.

function QuizBullets() {
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [locked, setLocked] = useState<Record<number, boolean>>({});

  const toggle = (i: number) => {
    if (!locked[i] && userAnswers[i]?.trim()) {
      setLocked((l) => ({ ...l, [i]: true }));
    }
    setExpanded((e) => ({ ...e, [i]: !e[i] }));
  };

  const lockAndReveal = (i: number) => {
    if (!userAnswers[i]?.trim()) return;
    setLocked((l) => ({ ...l, [i]: true }));
    setExpanded((e) => ({ ...e, [i]: true }));
  };

  return (
    <div className="space-y-1">
      {/* Quiz tag badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700 border border-violet-200">
          #quiz
        </span>
        <span className="text-xs text-slate-400">
          Answer each question, then click to reveal
        </span>
      </div>

      {SAMPLE_QUESTIONS.map((q, i) => (
        <div key={i} className="group">
          {/* Question bullet */}
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

              {/* Inline answer input */}
              {!locked[i] && (
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Your answer..."
                    value={userAnswers[i] || ''}
                    onChange={(e) =>
                      setUserAnswers((a) => ({ ...a, [i]: e.target.value }))
                    }
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

              {/* Answer (nested bullet) */}
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
                      {/* User's answer */}
                      <p className="text-sm text-slate-500 italic">
                        You said: &ldquo;{userAnswers[i]}&rdquo;
                      </p>
                      {/* Model answer */}
                      <p className="text-sm text-violet-900 leading-relaxed">
                        {q.answer}
                      </p>
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

// ─── Mockup 3: Conversation with Kitten ─────────────────────────────────────
// Questions appear as speech bubbles from a kitten. Karen replies in her own
// bubble. The kitten then responds with the model answer — like a real chat.

function KittenConversation() {
  const [currentQ, setCurrentQ] = useState(0);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<
    { role: 'kitten' | 'karen' | 'reveal'; text: string }[]
  >([{ role: 'kitten', text: SAMPLE_QUESTIONS[0].question }]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;
    const userText = input.trim();
    setInput('');

    // Add Karen's message
    setMessages((m) => [...m, { role: 'karen', text: userText }]);

    // Kitten "types" then reveals answer
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((m) => [
        ...m,
        { role: 'reveal', text: SAMPLE_QUESTIONS[currentQ].answer },
      ]);

      // Queue next question
      const nextQ = currentQ + 1;
      if (nextQ < SAMPLE_QUESTIONS.length) {
        setTimeout(() => {
          setCurrentQ(nextQ);
          setMessages((m) => [
            ...m,
            { role: 'kitten', text: SAMPLE_QUESTIONS[nextQ].question },
          ]);
        }, 800);
      }
    }, 1200);
  };

  const allDone = currentQ >= SAMPLE_QUESTIONS.length - 1 &&
    messages.some((m) => m.role === 'reveal' && m.text === SAMPLE_QUESTIONS[SAMPLE_QUESTIONS.length - 1].answer);

  return (
    <div className="flex flex-col h-[520px] rounded-xl border border-teal-200 bg-gradient-to-b from-teal-50/40 to-white overflow-hidden">
      {/* Chat header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-teal-50 border-b border-teal-200/60">
        <div className="w-8 h-8 rounded-full bg-teal-200 flex items-center justify-center">
          <img
            src="/api/kittens/shows-book"
            alt=""
            className="w-7 h-7 object-contain"
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-teal-900">Quiz Kitten</p>
          <p className="text-[10px] text-teal-500 uppercase tracking-wider">Check Your Understanding</p>
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
              className={cn(
                'flex',
                msg.role === 'karen' ? 'justify-end' : 'justify-start'
              )}
            >
              {msg.role === 'kitten' && (
                <div className="max-w-[80%] flex items-end gap-2">
                  <MessageCircle
                    size={16}
                    className="text-teal-400 shrink-0 mb-1"
                  />
                  <div className="rounded-2xl rounded-bl-md px-4 py-2.5 bg-white border border-teal-200/60 shadow-sm">
                    <p className="text-sm text-slate-800 leading-relaxed">
                      {msg.text}
                    </p>
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
                  <Sparkles
                    size={14}
                    className="text-amber-400 shrink-0 mb-1"
                  />
                  <div className="rounded-2xl rounded-bl-md px-4 py-2.5 bg-amber-50 border border-amber-200/60 shadow-sm">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-500 mb-1">
                      Model Answer
                    </p>
                    <p className="text-sm text-amber-900 leading-relaxed">
                      {msg.text}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}

          {/* Typing indicator */}
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
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: dot * 0.15,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Completion message */}
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

// ─── Page ───────────────────────────────────────────────────────────────────

export default function QAMockupsPage() {
  const [active, setActive] = useState(0);

  const mockups = [
    {
      id: 'callout',
      label: 'Callout Q&A',
      tagline: 'Question callout + embedded answer input',
      color: 'amber',
      component: <CalloutQA />,
    },
    {
      id: 'quiz-bullets',
      label: 'Quiz Bullets',
      tagline: 'Bullet list with #quiz tag, nested answers',
      color: 'violet',
      component: <QuizBullets />,
    },
    {
      id: 'kitten-chat',
      label: 'Kitten Chat',
      tagline: 'Conversational Q&A with the quiz kitten',
      color: 'teal',
      component: <KittenConversation />,
    },
  ];

  const tabColors: Record<string, { active: string; inactive: string; border: string }> = {
    amber: {
      active: 'bg-amber-100 text-amber-900 border-amber-400',
      inactive: 'text-amber-700/60 hover:text-amber-800 hover:bg-amber-50',
      border: 'border-amber-200',
    },
    violet: {
      active: 'bg-violet-100 text-violet-900 border-violet-400',
      inactive: 'text-violet-700/60 hover:text-violet-800 hover:bg-violet-50',
      border: 'border-violet-200',
    },
    teal: {
      active: 'bg-teal-100 text-teal-900 border-teal-400',
      inactive: 'text-teal-700/60 hover:text-teal-800 hover:bg-teal-50',
      border: 'border-teal-200',
    },
  };

  return (
    <div className="min-h-screen bg-[#faf8f4] p-6 md:p-12">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold font-serif text-slate-900">
            Q&A Feature Mockups
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Three approaches for interactive &ldquo;Check Your Understanding&rdquo;
            questions in lesson slides. Each uses the same three questions from
            <em> The Chat Room</em> lesson.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-slate-100 rounded-lg">
          {mockups.map((m, i) => {
            const colors = tabColors[m.color];
            return (
              <button
                key={m.id}
                onClick={() => setActive(i)}
                className={cn(
                  'flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all border border-transparent',
                  active === i ? colors.active : colors.inactive
                )}
              >
                <span className="block">{m.label}</span>
                <span className="block text-[10px] font-normal opacity-70 mt-0.5 hidden sm:block">
                  {m.tagline}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active mockup */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mockups[active].id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            {/* Context: how it would appear in markdown */}
            <div className="mb-6 p-4 rounded-lg bg-slate-800 text-slate-300 font-mono text-xs leading-relaxed overflow-x-auto">
              {mockups[active].id === 'callout' && (
                <pre>{`> [!QUESTION] Think About It
> 1. What's the difference between what Claude did...
>
> > [!ANSWER]
> > A regular chatbot would have *described* a folder
> > structure. Claude actually created it.`}</pre>
              )}
              {mockups[active].id === 'quiz-bullets' && (
                <pre>{`## Check Your Understanding #quiz

- What's the difference between what Claude did...
  - A regular chatbot would have *described* a folder
    structure. Claude actually created it.
- You tried two agents — did you notice differences?
  - They have different personalities and styles...`}</pre>
              )}
              {mockups[active].id === 'kitten-chat' && (
                <pre>{`> [!QUIZ] Check Your Understanding
> - What's the difference between what Claude did...
>   - A regular chatbot would have *described*...
> - You tried two agents — did you notice differences?
>   - They have different personalities...`}</pre>
              )}
            </div>

            {/* The interactive mockup */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-xl font-serif font-bold text-slate-800 mb-1">
                Check Your Understanding
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                from <em>The Chat Room</em> &mdash; Lesson 1
              </p>
              {mockups[active].component}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
