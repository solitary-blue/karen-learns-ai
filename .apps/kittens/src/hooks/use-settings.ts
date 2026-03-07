/* eslint-disable react-hooks/globals */
'use client';

import { useState, useEffect, useCallback } from 'react';
import { findClosestWeight, getAvailableWeights } from '@/lib/font-weights';

const STORAGE_KEY_MAIN_FONT = 'kittens-font-main';
const STORAGE_KEY_TITLE_FONT = 'kittens-font-title';

export interface FontOption {
  name: string;
  value: string;
  weight?: number;
  availableWeights?: number[];
}

function resolveStoredFont(storageKey: string, fallback: FontOption): FontOption {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const saved = window.localStorage.getItem(storageKey);
  if (!saved) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(saved);
    if (
      parsed
      && typeof parsed === 'object'
      && typeof parsed.name === 'string'
      && typeof parsed.value === 'string'
    ) {
      return parsed;
    }
  } catch (e) {
    console.error(`Failed to parse font setting for ${storageKey}`, e);
  }

  return fallback;
}

// Shared state so all useSettings consumers stay in sync
let sharedMainFont: FontOption | null = null;
let sharedTitleFont: FontOption | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach(fn => fn());
}

export function useSettings(defaultMain: FontOption, defaultTitle: FontOption) {
  // Initialize shared state from localStorage on first use
  // This is a valid pattern for sharing state across components
  if (!sharedMainFont) {
    const stored = resolveStoredFont(STORAGE_KEY_MAIN_FONT, defaultMain);
    // Ensure weight is always set
    sharedMainFont = {
      ...stored,
      weight: stored.weight || 400
    };
  }
  if (!sharedTitleFont) {
    const stored = resolveStoredFont(STORAGE_KEY_TITLE_FONT, defaultTitle);
    // Ensure weight is always set
    sharedTitleFont = {
      ...stored,
      weight: stored.weight || 400
    };
  }

  const [, rerender] = useState(0);

  // Subscribe to shared state changes
  useEffect(() => {
    const listener = () => rerender(n => n + 1);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  // Keep CSS variables in sync on mount
  useEffect(() => {
    if (sharedMainFont) {
      document.documentElement.style.setProperty('--font-main', sharedMainFont.value);
      document.documentElement.style.setProperty('--font-main-weight', String(sharedMainFont.weight || 400));
    }
    if (sharedTitleFont) {
      document.documentElement.style.setProperty('--font-title', sharedTitleFont.value);
      document.documentElement.style.setProperty('--font-title-weight', String(sharedTitleFont.weight || 400));
    }
  }, []);

  const updateMainFont = useCallback((font: FontOption) => {
    const availableWeights = font.availableWeights || getAvailableWeights(font.name);
    const targetWeight = font.weight || sharedMainFont?.weight || 400;
    const closestWeight = findClosestWeight(targetWeight, availableWeights);
    
    const fontWithWeight = { ...font, weight: closestWeight };
    sharedMainFont = fontWithWeight;
    document.documentElement.style.setProperty('--font-main', fontWithWeight.value);
    document.documentElement.style.setProperty('--font-main-weight', String(closestWeight));
    localStorage.setItem(STORAGE_KEY_MAIN_FONT, JSON.stringify(fontWithWeight));
    notify();
  }, []);

  const updateTitleFont = useCallback((font: FontOption) => {
    const availableWeights = font.availableWeights || getAvailableWeights(font.name);
    const targetWeight = font.weight || sharedTitleFont?.weight || 400;
    const closestWeight = findClosestWeight(targetWeight, availableWeights);
    
    const fontWithWeight = { ...font, weight: closestWeight };
    sharedTitleFont = fontWithWeight;
    document.documentElement.style.setProperty('--font-title', fontWithWeight.value);
    document.documentElement.style.setProperty('--font-title-weight', String(closestWeight));
    localStorage.setItem(STORAGE_KEY_TITLE_FONT, JSON.stringify(fontWithWeight));
    notify();
  }, []);

  const updateMainFontWeight = useCallback((weight: number) => {
    if (sharedMainFont) {
      const fontWithWeight = { ...sharedMainFont, weight };
      sharedMainFont = fontWithWeight;
      document.documentElement.style.setProperty('--font-main-weight', String(weight));
      localStorage.setItem(STORAGE_KEY_MAIN_FONT, JSON.stringify(fontWithWeight));
      console.log('Updated main font weight:', fontWithWeight);
      notify();
    }
  }, []);

  const updateTitleFontWeight = useCallback((weight: number) => {
    if (sharedTitleFont) {
      const fontWithWeight = { ...sharedTitleFont, weight };
      sharedTitleFont = fontWithWeight;
      document.documentElement.style.setProperty('--font-title-weight', String(weight));
      localStorage.setItem(STORAGE_KEY_TITLE_FONT, JSON.stringify(fontWithWeight));
      console.log('Updated title font weight:', fontWithWeight);
      notify();
    }
  }, []);

  return {
    mainFont: sharedMainFont ? { ...sharedMainFont, weight: sharedMainFont.weight || 400 } : { name: 'Avenir Next', value: '"Avenir Next", Avenir, system-ui, sans-serif', weight: 400 },
    titleFont: sharedTitleFont ? { ...sharedTitleFont, weight: sharedTitleFont.weight || 400 } : { name: 'Georgia', value: 'Georgia, serif', weight: 400 },
    updateMainFont,
    updateTitleFont,
    updateMainFontWeight,
    updateTitleFontWeight,
  };
}
