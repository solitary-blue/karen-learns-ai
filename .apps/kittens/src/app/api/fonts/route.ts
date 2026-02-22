import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

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

export async function GET() {
  const configPath = path.join(process.cwd(), 'local-fonts.yml');
  
  try {
    if (fs.existsSync(configPath)) {
      const fileContents = fs.readFileSync(configPath, 'utf8');
      const data = yaml.load(fileContents) as any;
      return NextResponse.json({
        mainFonts: data.mainFonts || DEFAULT_MAIN,
        titleFonts: data.titleFonts || DEFAULT_TITLE,
      });
    }
  } catch (error) {
    console.error('Failed to load font config:', error);
  }

  return NextResponse.json({
    mainFonts: DEFAULT_MAIN,
    titleFonts: DEFAULT_TITLE,
  });
}
