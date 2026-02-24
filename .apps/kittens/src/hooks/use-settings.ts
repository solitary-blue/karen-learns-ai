'use client';

import { useState, useEffect } from 'react';

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

export function useSettings(defaultMain: FontOption, defaultTitle: FontOption) {
  const [mainFont, setMainFont] = useState<FontOption>(() => resolveStoredFont(STORAGE_KEY_MAIN_FONT, defaultMain));
  const [titleFont, setTitleFont] = useState<FontOption>(() => resolveStoredFont(STORAGE_KEY_TITLE_FONT, defaultTitle));

  // Keep CSS variables in sync with selected fonts.
  useEffect(() => {
    document.documentElement.style.setProperty('--font-main', mainFont.value);
  }, [mainFont]);

  useEffect(() => {
    document.documentElement.style.setProperty('--font-title', titleFont.value);
  }, [titleFont]);

  const updateMainFont = (font: FontOption) => {
    setMainFont(font);
    document.documentElement.style.setProperty('--font-main', font.value);
    localStorage.setItem(STORAGE_KEY_MAIN_FONT, JSON.stringify(font));
  };

  const updateTitleFont = (font: FontOption) => {
    setTitleFont(font);
    document.documentElement.style.setProperty('--font-title', font.value);
    localStorage.setItem(STORAGE_KEY_TITLE_FONT, JSON.stringify(font));
  };

  return {
    mainFont,
    titleFont,
    updateMainFont,
    updateTitleFont,
  };
}
