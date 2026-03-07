import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { GOOGLE_FONT_WEIGHTS } from '@/lib/font-weights-data';

// Safe Defaults
const DEFAULT_MAIN = [
  { name: 'Avenir Next', value: '"Avenir Next", Avenir, "Seravek", system-ui, sans-serif' },
  { name: 'Helvetica', value: 'Helvetica, "Helvetica Neue", Arial, sans-serif' },
  { name: 'Arial', value: 'Arial, sans-serif' },
];

const DEFAULT_TITLE = [
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Baskerville', value: 'Baskerville, "Baskerville Old Face", serif' },
  { name: 'Times New Roman', value: '"Times New Roman", Times, serif' },
];

function withAvailableWeights<T extends { name: string; fontFaces?: Array<{ weight: number | string }> }>(fonts: T[]): Array<T & { availableWeights: number[] }> {
  return fonts.map((font) => {
    const configuredWeights = font.fontFaces
      ? Array.from(
        new Set(
          font.fontFaces
            .map((face) => Number(face.weight))
            .filter((weight) => Number.isFinite(weight)),
        ),
      ).sort((a, b) => a - b)
      : [];

    const availableWeights = configuredWeights.length > 0
      ? configuredWeights
      : GOOGLE_FONT_WEIGHTS[font.name] || [400];

    return {
      ...font,
      availableWeights,
    };
  });
}

export async function GET() {
  const configPath = path.join(process.cwd(), 'local-fonts.yml');
  
  try {
    if (fs.existsSync(configPath)) {
      const fileContents = fs.readFileSync(configPath, 'utf8');
      const data = yaml.load(fileContents) as any;
      return NextResponse.json({
        mainFonts: withAvailableWeights(data.mainFonts || DEFAULT_MAIN),
        titleFonts: withAvailableWeights(data.titleFonts || DEFAULT_TITLE),
      });
    }
  } catch (error) {
    console.error('Failed to load font config:', error);
  }

  return NextResponse.json({
    mainFonts: withAvailableWeights(DEFAULT_MAIN),
    titleFonts: withAvailableWeights(DEFAULT_TITLE),
  });
}
