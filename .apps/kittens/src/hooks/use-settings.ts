'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY_MAIN_FONT = 'kittens-font-main';
const STORAGE_KEY_TITLE_FONT = 'kittens-font-title';

export interface FontOption {
  name: string;
  value: string;
}

export function useSettings(defaultMain: FontOption, defaultTitle: FontOption) {
  const [mainFont, setMainFont] = useState<FontOption>(defaultMain);
  const [titleFont, setTitleFont] = useState<FontOption>(defaultTitle);
  const [loaded, setLoaded] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedMain = localStorage.getItem(STORAGE_KEY_MAIN_FONT);
    const savedTitle = localStorage.getItem(STORAGE_KEY_TITLE_FONT);

    if (savedMain) {
      try {
        const font = JSON.parse(savedMain);
        setMainFont(font);
        document.documentElement.style.setProperty('--font-main', font.value);
      } catch (e) {
        console.error('Failed to parse main font setting', e);
      }
    }

    if (savedTitle) {
      try {
        const font = JSON.parse(savedTitle);
        setTitleFont(font);
        document.documentElement.style.setProperty('--font-title', font.value);
      } catch (e) {
        console.error('Failed to parse title font setting', e);
      }
    }
    
    setLoaded(true);
  }, []);

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
    loaded
  };
}
