'use client';

import { useEffect } from 'react';
import { GOOGLE_FONT_WEIGHTS } from './font-weights-data';

const loadedFonts = new Set<string>();

function getGoogleFontName(fontName: string): string | null {
  const googleFonts: Record<string, string> = {
    'Playfair Display': 'Playfair+Display',
    'Inter': 'Inter',
    'Crimson Pro': 'Crimson+Pro',
    'JetBrains Mono': 'JetBrains+Mono',
    'Space Grotesk': 'Space+Grotesk',
    'IBM Plex Mono': 'IBM+Plex+Mono',
    'Cormorant Garamond': 'Cormorant+Garamond',
    'EB Garamond': 'EB+Garamond',
    'Lexend': 'Lexend',
    'Bitter': 'Bitter',
    'Outfit': 'Outfit',
    'Lora': 'Lora',
    'DM Serif Display': 'DM+Serif+Display',
    'Fraunces': 'Fraunces',
    'Averia Libre': 'Averia+Libre',
  };
  return googleFonts[fontName] || null;
}

export function loadGoogleFont(fontName: string, weight: number) {
  const googleFontName = getGoogleFontName(fontName);
  if (!googleFontName) {
    console.log(`Not a Google Font: ${fontName}`);
    return;
  }
  
  const availableWeights = GOOGLE_FONT_WEIGHTS[fontName];
  if (!availableWeights) {
    console.log(`No weights found for: ${fontName}`);
    return;
  }
  
  const hasItalic = availableWeights.length > 0;
  const fontKey = `${fontName}-${weight}`;
  
  if (loadedFonts.has(fontKey)) {
    console.log(`Font already loaded: ${fontKey}`);
    return;
  }
  
  let fontUrl: string;
  
  if (fontName === 'DM Serif Display') {
    fontUrl = `https://fonts.googleapis.com/css2?family=${googleFontName}:ital@0;1&display=swap`;
  } else if (fontName === 'Fraunces') {
    fontUrl = `https://fonts.googleapis.com/css2?family=${googleFontName}:ital,opsz,wght@0,9..144,${weight};1,9..144,${weight}&display=swap`;
  } else if (hasItalic) {
    fontUrl = `https://fonts.googleapis.com/css2?family=${googleFontName}:ital,wght@0,${weight};1,${weight}&display=swap`;
  } else {
    fontUrl = `https://fonts.googleapis.com/css2?family=${googleFontName}:wght@${weight}&display=swap`;
  }
  
  console.log(`Loading font: ${fontKey}`, fontUrl);
  
  const link = document.createElement('link');
  link.href = fontUrl;
  link.rel = 'stylesheet';
  link.onload = () => {
    loadedFonts.add(fontKey);
    console.log(`Font loaded successfully: ${fontKey}`);
  };
  document.head.appendChild(link);
}

export function useDynamicFontLoader(fontName: string, weight: number) {
  useEffect(() => {
    loadGoogleFont(fontName, weight);
  }, [fontName, weight]);
}

export function preloadFontsWithWeights(fonts: Array<{ name: string; weight: number }>) {
  fonts.forEach(({ name, weight }) => {
    loadGoogleFont(name, weight);
  });
}
