'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY_MAIN_FONT = 'kittens-font-main';
const STORAGE_KEY_TITLE_FONT = 'kittens-font-title';

export interface FontOption {
  name: string;
  value: string;
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
  if (!sharedMainFont) {
    sharedMainFont = resolveStoredFont(STORAGE_KEY_MAIN_FONT, defaultMain);
  }
  if (!sharedTitleFont) {
    sharedTitleFont = resolveStoredFont(STORAGE_KEY_TITLE_FONT, defaultTitle);
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
    }
    if (sharedTitleFont) {
      document.documentElement.style.setProperty('--font-title', sharedTitleFont.value);
    }
  }, []);

  const updateMainFont = useCallback((font: FontOption) => {
    sharedMainFont = font;
    document.documentElement.style.setProperty('--font-main', font.value);
    localStorage.setItem(STORAGE_KEY_MAIN_FONT, JSON.stringify(font));
    notify();
  }, []);

  const updateTitleFont = useCallback((font: FontOption) => {
    sharedTitleFont = font;
    document.documentElement.style.setProperty('--font-title', font.value);
    localStorage.setItem(STORAGE_KEY_TITLE_FONT, JSON.stringify(font));
    notify();
  }, []);

  return {
    mainFont: sharedMainFont!,
    titleFont: sharedTitleFont!,
    updateMainFont,
    updateTitleFont,
  };
}
