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

function withResolvedWeight(font: FontOption): FontOption {
  return {
    ...font,
    weight: font.weight || 400,
  };
}

function syncCssVariables() {
  if (typeof document === 'undefined') {
    return;
  }

  if (sharedMainFont) {
    document.documentElement.style.setProperty('--font-main', sharedMainFont.value);
    document.documentElement.style.setProperty('--font-main-weight', String(sharedMainFont.weight || 400));
  }

  if (sharedTitleFont) {
    document.documentElement.style.setProperty('--font-title', sharedTitleFont.value);
    document.documentElement.style.setProperty('--font-title-weight', String(sharedTitleFont.weight || 400));
  }
}

// Shared state so all useSettings consumers stay in sync
let sharedMainFont: FontOption | null = null;
let sharedTitleFont: FontOption | null = null;
let hasHydratedStoredFonts = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach(fn => fn());
}

export function useSettings(defaultMain: FontOption, defaultTitle: FontOption) {
  // Initialize shared state with deterministic defaults so server and client
  // render the same markup before localStorage is applied after hydration.
  if (!sharedMainFont) {
    sharedMainFont = withResolvedWeight(defaultMain);
  }
  if (!sharedTitleFont) {
    sharedTitleFont = withResolvedWeight(defaultTitle);
  }

  const [, rerender] = useState(0);

  // Subscribe to shared state changes
  useEffect(() => {
    const listener = () => rerender(n => n + 1);
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  }, []);

  useEffect(() => {
    if (!hasHydratedStoredFonts) {
      hasHydratedStoredFonts = true;

      sharedMainFont = withResolvedWeight(resolveStoredFont(STORAGE_KEY_MAIN_FONT, sharedMainFont || defaultMain));
      sharedTitleFont = withResolvedWeight(resolveStoredFont(STORAGE_KEY_TITLE_FONT, sharedTitleFont || defaultTitle));

      syncCssVariables();
      notify();

      return;
    }

    syncCssVariables();
    // This hydration sync is intentionally one-time so shared settings are restored
    // from storage without re-applying later default values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateMainFont = useCallback((font: FontOption) => {
    const availableWeights = font.availableWeights || getAvailableWeights(font.name);
    const targetWeight = font.weight || sharedMainFont?.weight || 400;
    const closestWeight = findClosestWeight(targetWeight, availableWeights);
    
    const fontWithWeight = { ...font, weight: closestWeight };
    sharedMainFont = fontWithWeight;
    syncCssVariables();
    localStorage.setItem(STORAGE_KEY_MAIN_FONT, JSON.stringify(fontWithWeight));
    notify();
  }, []);

  const updateTitleFont = useCallback((font: FontOption) => {
    const availableWeights = font.availableWeights || getAvailableWeights(font.name);
    const targetWeight = font.weight || sharedTitleFont?.weight || 400;
    const closestWeight = findClosestWeight(targetWeight, availableWeights);
    
    const fontWithWeight = { ...font, weight: closestWeight };
    sharedTitleFont = fontWithWeight;
    syncCssVariables();
    localStorage.setItem(STORAGE_KEY_TITLE_FONT, JSON.stringify(fontWithWeight));
    notify();
  }, []);

  const updateMainFontWeight = useCallback((weight: number) => {
    if (sharedMainFont) {
      const fontWithWeight = { ...sharedMainFont, weight };
      sharedMainFont = fontWithWeight;
      syncCssVariables();
      localStorage.setItem(STORAGE_KEY_MAIN_FONT, JSON.stringify(fontWithWeight));
      console.log('Updated main font weight:', fontWithWeight);
      notify();
    }
  }, []);

  const updateTitleFontWeight = useCallback((weight: number) => {
    if (sharedTitleFont) {
      const fontWithWeight = { ...sharedTitleFont, weight };
      sharedTitleFont = fontWithWeight;
      syncCssVariables();
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
