'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, List, Info, CheckCircle, Flame, HelpCircle, 
  AlertTriangle, XCircle, Zap, Bug, Quote, ChevronLeft, ChevronRight,
  Sun, Moon, Layout, GraduationCap, Laptop, BookOpen, Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Theme Definitions ---

const THEMES = [
  {
    id: 'midnight-montessori',
    name: 'Midnight Montessori',
    type: 'dark',
    icon: <GraduationCap size={20} />,
    description: 'Deep slate with primary Montessori accents. Refined and academic.',
    styles: {
      background: 'bg-[#0f172a]',
      foreground: 'text-slate-50',
      card: 'bg-slate-800/50 border-slate-700',
      titleFont: 'font-serif',
      bodyFont: 'font-sans',
      primary: '#3b82f6',
      accent: '#ef4444',
      bulletColor: 'bg-blue-500',
      headerGradient: 'from-blue-600 to-indigo-700',
      calloutStyle: 'modern-glass',
    },
    calloutColors: {
      info: { bg: 'bg-blue-500/10', border: 'border-blue-500/50', text: 'text-blue-400' },
      success: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/50', text: 'text-emerald-400' },
      warning: { bg: 'bg-amber-500/10', border: 'border-amber-500/50', text: 'text-amber-400' },
      danger: { bg: 'bg-rose-500/10', border: 'border-rose-500/50', text: 'text-rose-400' },
      example: { bg: 'bg-violet-500/10', border: 'border-violet-500/50', text: 'text-violet-400' },
    },
    googleFonts: 'Playfair+Display:wght@700&family=Inter:wght@400;600',
  },
  {
    id: 'draculas-library',
    name: "Dracula's Library",
    type: 'dark',
    icon: <BookOpen size={20} />,
    description: "Karen's favorite. High contrast neon accents on deep purple-gray.",
    styles: {
      background: 'bg-[#282a36]',
      foreground: 'text-[#f8f8f2]',
      card: 'bg-[#44475a]/30 border-[#6272a4]',
      titleFont: 'font-serif',
      bodyFont: 'font-mono',
      primary: '#bd93f9',
      accent: '#ff79c6',
      bulletColor: 'bg-[#50fa7b]',
      headerGradient: 'from-[#6272a4] to-[#44475a]',
      calloutStyle: 'neon-border',
    },
    calloutColors: {
      info: { bg: 'bg-[#6272a4]/20', border: 'border-[#8be9fd]', text: 'text-[#8be9fd]' },
      success: { bg: 'bg-[#6272a4]/20', border: 'border-[#50fa7b]', text: 'text-[#50fa7b]' },
      warning: { bg: 'bg-[#6272a4]/20', border: 'border-[#f1fa8c]', text: 'text-[#f1fa8c]' },
      danger: { bg: 'bg-[#6272a4]/20', border: 'border-[#ff5555]', text: 'text-[#ff5555]' },
      example: { bg: 'bg-[#6272a4]/20', border: 'border-[#bd93f9]', text: 'text-[#bd93f9]' },
    },
    googleFonts: 'Crimson+Pro:wght@700&family=JetBrains+Mono:wght@400;500',
  },
  {
    id: 'cyber-scholar',
    name: 'Cyber-Scholar',
    type: 'dark',
    icon: <Laptop size={20} />,
    description: 'Futuristic, high-tech educational workspace. Grid layouts and glows.',
    styles: {
      background: 'bg-[#050505]',
      foreground: 'text-blue-100',
      card: 'bg-[#0a0a0a] border-blue-900/50 shadow-[0_0_15px_rgba(59,130,246,0.1)]',
      titleFont: 'font-sans font-black tracking-tight uppercase',
      bodyFont: 'font-mono',
      primary: '#60a5fa',
      accent: '#a78bfa',
      bulletColor: 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]',
      headerGradient: 'from-blue-900 to-black',
      calloutStyle: 'cyber',
    },
    calloutColors: {
      info: { bg: 'bg-blue-950/30', border: 'border-blue-500', text: 'text-blue-400' },
      success: { bg: 'bg-cyan-950/30', border: 'border-cyan-400', text: 'text-cyan-300' },
      warning: { bg: 'bg-yellow-950/30', border: 'border-yellow-500', text: 'text-yellow-400' },
      danger: { bg: 'bg-red-950/30', border: 'border-red-600', text: 'text-red-500' },
      example: { bg: 'bg-purple-950/30', border: 'border-purple-500', text: 'text-purple-400' },
    },
    googleFonts: 'Space+Grotesk:wght@700&family=IBM+Plex+Mono:wght@400;500',
  },
  {
    id: 'parchment-ink',
    name: 'Parchment & Ink',
    type: 'light',
    icon: <Sparkles size={20} />,
    description: 'Classical scholarly aesthetic. Warm textures and elegant serifs.',
    styles: {
      background: 'bg-[#fcf9f2]',
      foreground: 'text-[#1a1a1a]',
      card: 'bg-[#f5f1e8] border-[#dcd3bc] shadow-sm',
      titleFont: 'font-serif italic',
      bodyFont: 'font-serif',
      primary: '#991b1b',
      accent: '#1e3a8a',
      bulletColor: 'bg-[#991b1b]',
      headerGradient: 'from-[#e5e0d3] to-[#dcd3bc]',
      calloutStyle: 'classic',
    },
    calloutColors: {
      info: { bg: 'bg-[#eef2ff]', border: 'border-[#3730a3]', text: 'text-[#3730a3]' },
      success: { bg: 'bg-[#f0fdf4]', border: 'border-[#166534]', text: 'text-[#166534]' },
      warning: { bg: 'bg-[#fffbeb]', border: 'border-[#92400e]', text: 'text-[#92400e]' },
      danger: { bg: 'bg-[#fef2f2]', border: 'border-[#991b1b]', text: 'text-[#991b1b]' },
      example: { bg: 'bg-[#f5f3ff]', border: 'border-[#5b21b6]', text: 'text-[#5b21b6]' },
    },
    googleFonts: 'Cormorant+Garamond:ital,wght@0,600;1,600&family=EB+Garamond:wght@400;500',
  },
  {
    id: 'sunlit-studio',
    name: 'Sunlit Studio',
    type: 'light',
    icon: <Sun size={20} />,
    description: 'Bright, airy, and modern. High legibility and soft pastels.',
    styles: {
      background: 'bg-white',
      foreground: 'text-slate-700',
      card: 'bg-slate-50 border-slate-200 shadow-sm rounded-2xl',
      titleFont: 'font-sans font-bold',
      bodyFont: 'font-sans',
      primary: '#2dd4bf',
      accent: '#fb923c',
      bulletColor: 'bg-teal-400',
      headerGradient: 'from-teal-50 to-white',
      calloutStyle: 'soft',
    },
    calloutColors: {
      info: { bg: 'bg-sky-50', border: 'border-sky-200', text: 'text-sky-600' },
      success: { bg: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-600' },
      warning: { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-600' },
      danger: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-600' },
      example: { bg: 'bg-indigo-50', border: 'border-indigo-200', text: 'text-indigo-600' },
    },
    googleFonts: 'Lexend:wght@400;600;700',
  },
];

// --- Components ---

const Callout = ({ type, title, children, theme, kitten }: any) => {
  const icons: Record<string, any> = {
    note: FileText,
    abstract: List,
    info: Info,
    todo: CheckCircle,
    tip: Flame,
    success: CheckCircle,
    question: HelpCircle,
    warning: AlertTriangle,
    failure: XCircle,
    danger: Zap,
    bug: Bug,
    example: List,
    quote: Quote,
  };

  const Icon = icons[type] || FileText;

  // Semantic mapping
  const getSemanticType = (type: string) => {
    if (['success', 'todo', 'tip'].includes(type)) return 'success';
    if (['warning', 'question'].includes(type)) return 'warning';
    if (['danger', 'failure', 'bug'].includes(type)) return 'danger';
    if (['example'].includes(type)) return 'example';
    return 'info'; // note, abstract, info, quote default to info
  };

  const semanticType = getSemanticType(type);
  const colors = theme.calloutColors[semanticType];

  // Base styles for different callout modes
  const getCalloutStyles = () => {
    const s = theme.styles;
    switch (s.calloutStyle) {
      case 'modern-glass':
        return cn(colors.bg, 'backdrop-blur-sm border', colors.border, 'rounded-lg overflow-hidden');
      case 'neon-border':
        return cn(colors.bg, 'border-l-4', colors.border, 'rounded-r-lg overflow-hidden');
      case 'cyber':
        return cn(colors.bg, 'border', colors.border.replace('border-', 'border-opacity-30 border-'), 'rounded-none border-l-2', colors.border, 'overflow-hidden');
      case 'classic':
        return cn(colors.bg, 'border', colors.border, 'rounded-sm overflow-hidden');
      case 'soft':
        return cn(colors.bg, 'border-none rounded-2xl overflow-hidden');
      default:
        return 'bg-muted border rounded-lg overflow-hidden';
    }
  };

  const getHeaderStyles = () => {
    const s = theme.styles;
    switch (s.calloutStyle) {
      case 'modern-glass': return cn('bg-slate-700/30 px-4 py-2 flex items-center gap-2 font-bold', colors.text);
      case 'neon-border': return cn('px-4 py-2 flex items-center gap-2 font-bold', colors.text);
      case 'cyber': return cn('bg-opacity-20 px-4 py-2 flex items-center gap-2 font-mono text-xs uppercase tracking-widest', colors.bg.replace('bg-', 'bg-opacity-20 bg-'), colors.text);
      case 'classic': return cn('border-b px-4 py-2 flex items-center gap-2 font-serif font-bold', colors.border, colors.text);
      case 'soft': return cn('px-4 py-2 flex items-center gap-2 font-bold', colors.text);
      default: return 'px-4 py-2 flex items-center gap-2 font-bold';
    }
  };

  return (
    <div className={cn("relative my-6", getCalloutStyles())}>
      <div className={getHeaderStyles()}>
        <Icon size={18} />
        <span>{title}</span>
      </div>
      <div className="px-4 py-3 text-sm leading-relaxed opacity-90">
        {children}
      </div>
      {kitten && (
        <img 
          src={`/api/kittens/${kitten}`} 
          alt="Kitten" 
          className="absolute bottom-1 right-1 h-24 w-auto opacity-80 pointer-events-none select-none"
        />
      )}
    </div>
  );
};

export default function MockupsPage() {
  const [currentThemeIndex, setCurrentThemeIndex] = useState(0);
  const theme = THEMES[currentThemeIndex];

  const nextTheme = () => setCurrentThemeIndex((prev) => (prev + 1) % THEMES.length);
  const prevTheme = () => setCurrentThemeIndex((prev) => (prev - 1 + THEMES.length) % THEMES.length);

  return (
    <div className={cn("min-h-screen transition-colors duration-700 p-4 md:p-8 flex flex-col items-center", theme.styles.background)}>
      {/* Dynamic Google Fonts */}
      <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?family=${theme.googleFonts}&display=swap`} />
      
      {/* Navigation Widget */}
      <div className="fixed top-6 z-50 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-2 py-2 flex items-center gap-2 shadow-2xl">
        <button 
          onClick={prevTheme}
          className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
          title="Previous Mockup"
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className="flex items-center gap-3 px-4 overflow-hidden max-w-[200px] md:max-w-md">
          <AnimatePresence mode="wait">
            <motion.div 
              key={theme.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className="flex flex-col items-center whitespace-nowrap"
            >
              <div className="flex items-center gap-2 text-white font-bold">
                {theme.icon}
                <span>{theme.name}</span>
              </div>
              <span className="text-[10px] text-white/60 uppercase tracking-widest font-mono">
                Mockup {currentThemeIndex + 1} of {THEMES.length}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        <button 
          onClick={nextTheme}
          className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
          title="Next Mockup"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-4xl mt-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={theme.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={cn("w-full h-full", theme.styles.foreground)}
            style={{ 
              fontFamily: theme.styles.bodyFont.includes('serif') ? '"EB Garamond", serif' : 
                          theme.styles.bodyFont.includes('mono') ? '"JetBrains Mono", monospace' : 
                          theme.styles.bodyFont.includes('sans') ? '"Inter", sans-serif' : 'sans-serif' 
            }}
          >
            {/* Slide Header */}
            <div className="mb-12">
              <h1 className={cn("text-4xl md:text-6xl mb-6", theme.styles.titleFont)}
                  style={{ 
                    fontFamily: theme.styles.titleFont.includes('serif') ? (theme.id === 'parchment-ink' ? '"Cormorant Garamond", serif' : '"Playfair Display", serif') : 
                                theme.styles.titleFont.includes('sans') ? '"Space Grotesk", sans-serif' : 'sans-serif' 
                  }}>
                The Cosmic Education of Karen
              </h1>
              <div className={cn("h-1 w-32 rounded-full bg-gradient-to-r", theme.styles.headerGradient)} />
            </div>

            {/* Bullet Points Section */}
            <div className="space-y-4 mb-16">
              {[
                "Presenting the 'Whole' before the 'Parts' helps contextualize learning.",
                "Environment is the 'Third Teacher' - it must be prepared with care.",
                "Follow the learner: provide tools for independence and self-discovery.",
                "Bridge the gap between Montessori philosophy and Agentic AI."
              ].map((point, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className={cn("mt-2.5 w-2.5 h-2.5 rounded-full shrink-0", theme.styles.bulletColor)} />
                  <p className="text-lg md:text-xl leading-relaxed">{point}</p>
                </motion.div>
              ))}
            </div>

            {/* Callouts Section - Grid for Mockup visibility */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-32">
              <Callout type="note" title="Philosophy Note" theme={theme}>
                "The child is both a hope and a promise for mankind." - Maria Montessori. This quote reminds us why we build these tools.
              </Callout>

              <Callout type="tip" title="Pro Tip" theme={theme} kitten="shows-book">
                Try using the "Whole-Parts" strategy when explaining complex LLM concepts to Karen. It reduces cognitive load significantly.
              </Callout>

              <Callout type="success" title="Milestone Reached" theme={theme} kitten="excited-chemist">
                Karen successfully initialized her first Git repository! The transition from observer to practitioner has begun.
              </Callout>

              <Callout type="warning" title="Potential Pitfall" theme={theme} kitten="concerned-chemist">
                Be careful not to introduce too many technical terms at once. Focus on the concept first, the syntax later.
              </Callout>

              <Callout type="question" title="Reflection Question" theme={theme}>
                How might we adapt the concept of "The Prepared Environment" to a digital workspace? What does a "prepared" terminal look like?
              </Callout>

              <Callout type="danger" title="Critical Warning" theme={theme}>
                Avoid leaking environment variables. The `.envrc` file is your first line of defense in the Montessori-AI ecosystem.
              </Callout>

              <Callout type="example" title="Code Example" theme={theme} kitten="suit-arms-crossed">
                <code className="block mt-2 font-mono text-xs opacity-80">
                  git commit -m "tech: 🙈 setup direnv and sops"
                </code>
              </Callout>

              <Callout type="quote" title="Montessori Insight" theme={theme}>
                "Help me to do it by myself." This is the core mandate of an effective AI agent designed for education.
              </Callout>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Theme Info Panel */}
      <div className="fixed bottom-6 right-6 max-w-xs bg-black/40 backdrop-blur-lg p-4 rounded-xl border border-white/10 text-white shadow-xl hidden md:block">
        <h3 className="font-bold mb-1 flex items-center gap-2">
          {theme.type === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
          Theme: {theme.name}
        </h3>
        <p className="text-xs text-white/70 mb-3">{theme.description}</p>
        <div className="flex gap-2">
          <div className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: theme.styles.primary }} />
          <div className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: theme.styles.accent }} />
          <div className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: theme.styles.bulletColor }} />
        </div>
      </div>
    </div>
  );
}
