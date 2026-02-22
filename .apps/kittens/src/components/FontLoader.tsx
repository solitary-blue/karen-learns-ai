'use client';

import { useEffect, useState } from 'react';

interface FontFace {
  weight: number | string;
  style: string;
  sources: string[];
}

interface FontConfig {
  name: string;
  value: string;
  fontFaces?: FontFace[];
}

interface FontData {
  mainFonts: FontConfig[];
  titleFonts: FontConfig[];
}

export function FontLoader() {
  const [styleContent, setStyleContent] = useState('');

  useEffect(() => {
    async function loadFonts() {
      try {
        const res = await fetch('/api/fonts');
        if (res.ok) {
          const data: FontData = await res.json();
          let css = '';

          const processFonts = (fonts: FontConfig[]) => {
            fonts.forEach(font => {
              if (font.fontFaces) {
                // Determine the family name from the 'value' or 'name'
                // Usually the first font in the stack is the family name we want to define.
                // e.g. value: 'Bliss, system-ui' -> Family 'Bliss'
                const familyName = font.name; // Use the name from config as the key

                font.fontFaces.forEach(face => {
                  const sources = face.sources.map(src => `url('/api/fonts/proxy?file=${encodeURIComponent(src)}')`).join(', ');
                  css += `
@font-face {
  font-family: '${familyName}';
  src: ${sources};
  font-weight: ${face.weight};
  font-style: ${face.style};
}`;
                });
              }
            });
          };

          processFonts(data.mainFonts);
          processFonts(data.titleFonts);
          setStyleContent(css);
        }
      } catch (e) {
        console.error('Failed to load font definitions', e);
      }
    }
    loadFonts();
  }, []);

  if (!styleContent) return null;

  return (
    <style dangerouslySetInnerHTML={{ __html: styleContent }} />
  );
}
