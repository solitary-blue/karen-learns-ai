'use client';

import { useSettings } from '@/hooks/use-settings';
import { useDynamicFontLoader } from '@/lib/dynamic-font-loader';

const DEFAULT_MAIN_FONT = {
  name: 'Avenir Next',
  value: '"Avenir Next", Avenir, "Seravek", system-ui, sans-serif',
};

const DEFAULT_TITLE_FONT = {
  name: 'Georgia',
  value: 'Georgia, serif',
};

export function AppFontManager() {
  const { mainFont, titleFont } = useSettings(DEFAULT_MAIN_FONT, DEFAULT_TITLE_FONT);

  useDynamicFontLoader(mainFont.name, mainFont.weight || 400);
  useDynamicFontLoader(titleFont.name, titleFont.weight || 400);

  return null;
}
