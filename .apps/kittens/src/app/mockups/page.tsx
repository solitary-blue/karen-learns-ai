'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, List, Info, CheckCircle, Flame, HelpCircle, 
  AlertTriangle, XCircle, Zap, Bug, Quote, ChevronLeft, ChevronRight,
  Sun, Moon, Layout, GraduationCap, Laptop, BookOpen, Sparkles,
  Mountain, Waves, Leaf, Snowflake, Sunset
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSettings, FontOption } from '@/hooks/use-settings';

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
  {
    id: 'obsidian-forge',
    name: 'Obsidian Forge',
    type: 'dark',
    icon: <Mountain size={20} />,
    description: 'Volcanic black with molten copper. Inset shadows and double borders evoke stamped metal.',
    styles: {
      background: 'bg-[#0c0a08]',
      foreground: 'text-[#e8dfd0]',
      card: 'bg-[#1a1610] border-2 border-[#3a2a1a] shadow-[inset_0_1px_4px_rgba(0,0,0,0.5)]',
      titleFont: 'font-serif font-bold',
      bodyFont: 'font-serif',
      titleFontFamily: '"Bitter", serif',
      bodyFontFamily: 'Charter, "Bitstream Charter", Georgia, serif',
      primary: '#c87533',
      accent: '#e8a04a',
      bulletColor: 'bg-[#c87533] shadow-[0_0_6px_rgba(200,117,51,0.4)]',
      headerGradient: 'from-[#2a1f14] to-[#0c0a08]',
      calloutStyle: 'inset-forge',
    },
    calloutColors: {
      info: { bg: 'bg-[#141210]', border: 'border-[#4a6a9a]', text: 'text-[#7a9ac8]' },
      success: { bg: 'bg-[#121410]', border: 'border-[#5a7a4a]', text: 'text-[#8ab87a]' },
      warning: { bg: 'bg-[#161410]', border: 'border-[#c87533]', text: 'text-[#daa06d]' },
      danger: { bg: 'bg-[#161210]', border: 'border-[#a04040]', text: 'text-[#d06858]' },
      example: { bg: 'bg-[#141214]', border: 'border-[#7a5a8a]', text: 'text-[#b08ac0]' },
    },
    googleFonts: 'Bitter:wght@400;700;900',
  },
  {
    id: 'aurora-borealis',
    name: 'Aurora Borealis',
    type: 'dark',
    icon: <Waves size={20} />,
    description: 'Arctic night with frosted glass cards. Vivid chromatic accents glow like northern lights.',
    styles: {
      background: 'bg-[#060d1a]',
      foreground: 'text-[#d4e4f8]',
      card: 'bg-[#0c1628]/80 backdrop-blur-sm border border-[#1a2a4a]',
      titleFont: 'font-sans font-bold tracking-tight',
      bodyFont: 'font-sans',
      titleFontFamily: '"Outfit", sans-serif',
      bodyFontFamily: 'Bliss, system-ui, sans-serif',
      primary: '#5ec4e8',
      accent: '#c084fc',
      bulletColor: 'bg-[#5ec4e8] shadow-[0_0_8px_rgba(94,196,232,0.4)]',
      headerGradient: 'from-[#0a1830] to-[#060d1a]',
      calloutStyle: 'aurora-glow',
    },
    calloutColors: {
      info: { bg: 'bg-[#0a1428]/60', border: 'border-[#3a9cc8]', text: 'text-[#6ac4ea]' },
      success: { bg: 'bg-[#081810]/60', border: 'border-[#34d399]', text: 'text-[#6ee7b7]' },
      warning: { bg: 'bg-[#181408]/60', border: 'border-[#e8a840]', text: 'text-[#fbbf24]' },
      danger: { bg: 'bg-[#180a0a]/60', border: 'border-[#f06080]', text: 'text-[#fb7185]' },
      example: { bg: 'bg-[#140a1c]/60', border: 'border-[#a78bfa]', text: 'text-[#c4b5fd]' },
    },
    googleFonts: 'Outfit:wght@400;600;700',
  },
  {
    id: 'botanical-press',
    name: 'Botanical Press',
    type: 'light',
    icon: <Leaf size={20} />,
    description: 'Warm ivory with sage and umber. Thick borders and pressed shadows recall fine letterpress printing.',
    styles: {
      background: 'bg-[#f5f0e4]',
      foreground: 'text-[#2a2a24]',
      card: 'bg-[#faf7f0] border-2 border-[#c8bfa8] shadow-sm',
      titleFont: 'font-serif italic',
      bodyFont: 'font-sans',
      titleFontFamily: '"Lora", serif',
      bodyFontFamily: 'Bliss, system-ui, sans-serif',
      primary: '#3a6e4a',
      accent: '#8b5e3c',
      bulletColor: 'bg-[#3a6e4a]',
      headerGradient: 'from-[#ece6d6] to-[#f5f0e4]',
      calloutStyle: 'botanical-etch',
    },
    calloutColors: {
      info: { bg: 'bg-[#eef0f6]', border: 'border-[#3a5090]', text: 'text-[#2e4478]' },
      success: { bg: 'bg-[#eef4ee]', border: 'border-[#3a6e4a]', text: 'text-[#2a5a3a]' },
      warning: { bg: 'bg-[#f6f0e4]', border: 'border-[#a07030]', text: 'text-[#7a5420]' },
      danger: { bg: 'bg-[#f6eeee]', border: 'border-[#903a3a]', text: 'text-[#782e2e]' },
      example: { bg: 'bg-[#f2eef6]', border: 'border-[#5a4080]', text: 'text-[#4a3468]' },
    },
    googleFonts: 'Lora:ital,wght@0,400;0,600;1,400;1,600',
  },
  {
    id: 'nordic-frost',
    name: 'Nordic Frost',
    type: 'light',
    icon: <Snowflake size={20} />,
    description: 'Icy whites and pale blues. Five-layer shadows create dramatic Scandinavian-minimal elevation.',
    styles: {
      background: 'bg-[#f0f4f8]',
      foreground: 'text-[#1a2030]',
      card: 'bg-white border border-[#d0dae8] rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,20,60,0.06)]',
      titleFont: 'font-serif font-bold',
      bodyFont: 'font-sans',
      titleFontFamily: '"DM Serif Display", serif',
      bodyFontFamily: 'Candara, sans-serif',
      primary: '#2a5c8a',
      accent: '#c84a60',
      bulletColor: 'bg-[#2a5c8a]',
      headerGradient: 'from-[#e4eaf2] to-[#f0f4f8]',
      calloutStyle: 'nordic-elevation',
    },
    calloutColors: {
      info: { bg: 'bg-white', border: 'border-[#3a6aa0]', text: 'text-[#2a5080]' },
      success: { bg: 'bg-white', border: 'border-[#2a8060]', text: 'text-[#1a6a48]' },
      warning: { bg: 'bg-white', border: 'border-[#c08030]', text: 'text-[#8a5a18]' },
      danger: { bg: 'bg-white', border: 'border-[#c04050]', text: 'text-[#9a2a3a]' },
      example: { bg: 'bg-white', border: 'border-[#6a4aa0]', text: 'text-[#503880]' },
    },
    googleFonts: 'DM+Serif+Display:ital@0;1',
  },
  {
    id: 'dusk-gradient',
    name: 'Dusk Gradient',
    type: 'dark',
    icon: <Sunset size={20} />,
    description: 'Twilight indigo-to-plum with warm peach accents. Cards float in layered warm and cool shadows.',
    styles: {
      background: 'bg-gradient-to-br from-[#1a1040] via-[#2a1848] to-[#3a1838]',
      foreground: 'text-[#f0e8e0]',
      card: 'bg-white/[0.06] backdrop-blur-md border border-white/[0.1] rounded-2xl shadow-[0_4px_20px_rgba(160,80,60,0.08),0_12px_40px_rgba(80,30,100,0.12)]',
      titleFont: 'font-serif font-bold',
      bodyFont: 'font-sans',
      titleFontFamily: '"Fraunces", serif',
      bodyFontFamily: '"Averia Libre", cursive',
      primary: '#f0a070',
      accent: '#c084fc',
      bulletColor: 'bg-[#f0a070] shadow-[0_0_8px_rgba(240,160,112,0.3)]',
      headerGradient: 'from-[#2a1848] to-[#1a1040]',
      calloutStyle: 'dusk-float',
    },
    calloutColors: {
      info: { bg: 'bg-[#1a1a3a]/40', border: 'border-[#6a9ae0]/40', text: 'text-[#8ab4f0]' },
      success: { bg: 'bg-[#1a2a1a]/40', border: 'border-[#60c090]/40', text: 'text-[#80daa8]' },
      warning: { bg: 'bg-[#2a1a10]/40', border: 'border-[#f0a070]/40', text: 'text-[#f0b888]' },
      danger: { bg: 'bg-[#2a1010]/40', border: 'border-[#f07080]/40', text: 'text-[#f09098]' },
      example: { bg: 'bg-[#1a1028]/40', border: 'border-[#c084fc]/40', text: 'text-[#d0a8ff]' },
    },
    googleFonts: 'Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;1,9..144,400',
  },
];

// Preload all Google Fonts so the font chooser works across themes
const ALL_GOOGLE_FONTS = [...new Set(THEMES.map(t => t.googleFonts))];

// Map each theme to its default title/body font for the font chooser
const THEME_FONTS: Record<string, { title: FontOption; body: FontOption }> = {
  'midnight-montessori': {
    title: { name: 'Playfair Display', value: '"Playfair Display", serif' },
    body: { name: 'Inter', value: '"Inter", system-ui, sans-serif' },
  },
  'draculas-library': {
    title: { name: 'Crimson Pro', value: '"Crimson Pro", serif' },
    body: { name: 'JetBrains Mono', value: '"JetBrains Mono", monospace' },
  },
  'cyber-scholar': {
    title: { name: 'Space Grotesk', value: '"Space Grotesk", sans-serif' },
    body: { name: 'IBM Plex Mono', value: '"IBM Plex Mono", monospace' },
  },
  'parchment-ink': {
    title: { name: 'Cormorant Garamond', value: '"Cormorant Garamond", serif' },
    body: { name: 'EB Garamond', value: '"EB Garamond", serif' },
  },
  'sunlit-studio': {
    title: { name: 'Lexend', value: '"Lexend", sans-serif' },
    body: { name: 'Lexend', value: '"Lexend", sans-serif' },
  },
  'obsidian-forge': {
    title: { name: 'Bitter', value: '"Bitter", serif' },
    body: { name: 'Charter', value: 'Charter, "Bitstream Charter", Georgia, serif' },
  },
  'aurora-borealis': {
    title: { name: 'Outfit', value: '"Outfit", sans-serif' },
    body: { name: 'Bliss', value: 'Bliss, system-ui, sans-serif' },
  },
  'botanical-press': {
    title: { name: 'Lora', value: '"Lora", serif' },
    body: { name: 'Bliss', value: 'Bliss, system-ui, sans-serif' },
  },
  'nordic-frost': {
    title: { name: 'DM Serif Display', value: '"DM Serif Display", serif' },
    body: { name: 'Candara', value: 'Candara, sans-serif' },
  },
  'dusk-gradient': {
    title: { name: 'Fraunces', value: '"Fraunces", serif' },
    body: { name: 'Averia Libre', value: '"Averia Libre", cursive' },
  },
};

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
      case 'inset-forge':
        return cn(colors.bg, 'border-2', colors.border, 'ring-1 ring-inset ring-white/[0.04] rounded-sm shadow-[inset_0_2px_8px_rgba(0,0,0,0.4)] overflow-hidden');
      case 'aurora-glow':
        return cn(colors.bg, 'backdrop-blur-sm border-l-[3px]', colors.border, 'border-y border-r border-white/[0.08] rounded-r-xl overflow-hidden');
      case 'botanical-etch':
        return cn(colors.bg, 'border-2', colors.border, 'rounded-lg shadow-[inset_0_1px_4px_rgba(0,0,0,0.08),0_2px_4px_rgba(0,0,0,0.04)] overflow-hidden');
      case 'nordic-elevation':
        return cn(colors.bg, 'border', colors.border, 'rounded-xl shadow-[0_0_0_1px_rgba(0,20,60,0.03),0_1px_2px_rgba(0,20,60,0.04),0_4px_8px_rgba(0,20,60,0.04),0_8px_16px_rgba(0,20,60,0.03),0_16px_32px_rgba(0,20,60,0.03)] overflow-hidden');
      case 'dusk-float':
        return cn(colors.bg, 'backdrop-blur-md border', colors.border, 'rounded-2xl shadow-[0_4px_20px_rgba(160,80,60,0.06),0_12px_40px_rgba(80,30,100,0.1)] overflow-hidden');
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
      case 'inset-forge': return cn('bg-black/20 px-4 py-2.5 flex items-center gap-2 font-bold uppercase tracking-wider text-sm', colors.text);
      case 'aurora-glow': return cn('bg-white/[0.04] px-4 py-2 flex items-center gap-2 font-semibold', colors.text);
      case 'botanical-etch': return cn('border-b-2 px-4 py-2 flex items-center gap-2 font-serif font-semibold italic', colors.border, colors.text);
      case 'nordic-elevation': return cn('border-b border-[#e8eef4] px-4 py-2.5 flex items-center gap-2 font-semibold text-sm tracking-wide', colors.text);
      case 'dusk-float': return cn('bg-white/[0.04] px-4 py-2 flex items-center gap-2 font-semibold', colors.text);
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
  const isDark = theme.type === 'dark';

  const defaultFonts = THEME_FONTS[theme.id];
  const { mainFont, titleFont, updateMainFont, updateTitleFont } = useSettings(
    defaultFonts?.body || { name: 'Avenir Next', value: '"Avenir Next", Avenir, system-ui, sans-serif' },
    defaultFonts?.title || { name: 'Georgia', value: 'Georgia, serif' },
  );

  // Reset fonts to theme defaults when switching themes
  useEffect(() => {
    const fonts = THEME_FONTS[theme.id];
    if (fonts) {
      updateMainFont(fonts.body);
      updateTitleFont(fonts.title);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentThemeIndex]);

  const nextTheme = () => setCurrentThemeIndex((prev) => (prev + 1) % THEMES.length);
  const prevTheme = () => setCurrentThemeIndex((prev) => (prev - 1 + THEMES.length) % THEMES.length);

  return (
    <div className={cn("min-h-screen transition-colors duration-700 p-4 md:p-8 flex flex-col items-center", theme.styles.background)}>
      {/* Preload all Google Fonts so font chooser works across themes */}
      {ALL_GOOGLE_FONTS.map(gf => (
        <link key={gf} rel="stylesheet" href={`https://fonts.googleapis.com/css2?family=${gf}&display=swap`} />
      ))}
      
      {/* Navigation Widget */}
      <div className={cn(
        "fixed top-6 z-50 backdrop-blur-md rounded-full px-2 py-2 flex items-center gap-2 shadow-2xl",
        isDark ? "bg-white/10 border border-white/20" : "bg-black/[0.06] border border-black/[0.1]"
      )}>
        <button
          onClick={prevTheme}
          className={cn("p-2 rounded-full transition-colors", isDark ? "hover:bg-white/20 text-white" : "hover:bg-black/10 text-black/80")}
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
              <div className={cn("flex items-center gap-2 font-bold", isDark ? "text-white" : "text-black/80")}>
                {theme.icon}
                <span>{theme.name}</span>
              </div>
              <span className={cn("text-[10px] uppercase tracking-widest font-mono", isDark ? "text-white/60" : "text-black/40")}>
                Mockup {currentThemeIndex + 1} of {THEMES.length}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>

        <button
          onClick={nextTheme}
          className={cn("p-2 rounded-full transition-colors", isDark ? "hover:bg-white/20 text-white" : "hover:bg-black/10 text-black/80")}
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
            style={{ fontFamily: mainFont.value }}
          >
            {/* Slide Header */}
            <div className="mb-12">
              <h1 className={cn("text-4xl md:text-6xl mb-6", theme.styles.titleFont)}
                  style={{ fontFamily: titleFont.value }}>
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
      <div className={cn(
        "fixed bottom-6 right-6 max-w-xs backdrop-blur-lg p-4 rounded-xl shadow-xl hidden md:block",
        isDark ? "bg-black/40 border border-white/10 text-white" : "bg-white/70 border border-black/10 text-[#1a1a1a]"
      )}>
        <h3 className="font-bold mb-1 flex items-center gap-2">
          {isDark ? <Moon size={16} /> : <Sun size={16} />}
          Theme: {theme.name}
        </h3>
        <p className={cn("text-xs mb-3", isDark ? "text-white/70" : "text-black/50")}>{theme.description}</p>
        <div className="flex gap-2">
          <div className={cn("w-6 h-6 rounded-full", isDark ? "border border-white/20" : "border border-black/15")} style={{ backgroundColor: theme.styles.primary }} />
          <div className={cn("w-6 h-6 rounded-full", isDark ? "border border-white/20" : "border border-black/15")} style={{ backgroundColor: theme.styles.accent }} />
          <div className={cn("w-6 h-6 rounded-full", isDark ? "border border-white/20" : "border border-black/15")} style={{ backgroundColor: theme.styles.bulletColor }} />
        </div>
      </div>
    </div>
  );
}
