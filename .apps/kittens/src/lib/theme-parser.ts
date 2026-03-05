import 'server-only';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { getProjectRoot } from './server-utils';

export interface ThemeColors {
  [key: string]: string;
}

export interface ThemeSemantics {
  [key: string]: string | ThemeSemantics;
}

export interface ThemeFonts {
  title?: string;
  main?: string;
}

export interface ThemeMascots {
  header?: string[];
  callouts?: Record<string, string | string[]>;
}

export interface ThemeDefinition {
  name: string;
  label: string;
  colors: ThemeColors;
  semantics: ThemeSemantics;
  fonts?: ThemeFonts;
  mascots?: ThemeMascots;
}

export interface ParsedTheme {
  definition: ThemeDefinition;
  cssVariables: Record<string, string>;
}

export interface ThemeConfig {
  themes: Record<string, ParsedTheme>;
  defaultTheme: string;
}

let cachedThemeConfig: ThemeConfig | null = null;

/**
 * Converts a hex color (e.g. #RRGGBB) to HSL values (H S% L%)
 */
export function hexToHsl(hex: string): string {
  // Remove hash if present
  hex = hex.replace(/^#/, '');

  if (hex.length === 3) {
    hex = hex.split('').map(x => x + x).join('');
  }

  // Parse r, g, b
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  const hDeg = Math.round(h * 360);
  const sPct = Math.round(s * 100);
  const lPct = Math.round(l * 100);

  return `${hDeg} ${sPct}% ${lPct}%`;
}

function resolveColor(value: string, colors: ThemeColors): string {
  // If it's a direct reference to a color key
  if (colors[value]) {
    return colors[value];
  }
  // If it's a hex code, return it as is
  return value;
}

function flattenSemantics(semantics: ThemeSemantics, colors: ThemeColors, prefix = ''): Record<string, string> {
  let result: Record<string, string> = {};
  
  for (const [key, value] of Object.entries(semantics)) {
    const newPrefix = prefix ? (key === 'DEFAULT' ? prefix : `${prefix}-${key}`) : key;
    
    if (typeof value === 'string') {
      const resolvedHex = resolveColor(value, colors);
      // We assume everything in semantics maps to colors, so we convert hex to HSL
      if (resolvedHex.startsWith('#')) {
        result[`--${newPrefix}`] = hexToHsl(resolvedHex);
      } else {
        result[`--${newPrefix}`] = resolvedHex; // Fallback
      }
    } else if (typeof value === 'object' && value !== null) {
      Object.assign(result, flattenSemantics(value, colors, newPrefix));
    }
  }
  
  return result;
}

export function loadThemeConfig(): ThemeConfig {
  if (cachedThemeConfig) return cachedThemeConfig;

  const themesDir = path.join(getProjectRoot(), 'themes');
  const config: ThemeConfig = {
    themes: {},
    defaultTheme: 'montessori'
  };

  try {
    if (fs.existsSync(themesDir)) {
      const files = fs.readdirSync(themesDir).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));
      
      for (const file of files) {
        const filePath = path.join(themesDir, file);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        try {
          const themeDef = yaml.load(fileContents) as ThemeDefinition;
          
          if (themeDef && themeDef.name) {
            // Flatten semantics to CSS variables
            const cssVariables = themeDef.semantics 
              ? flattenSemantics(themeDef.semantics, themeDef.colors || {}) 
              : {};
              
            // Add font variables
            if (themeDef.fonts?.title) {
              cssVariables['--font-title'] = themeDef.fonts.title;
            }
            if (themeDef.fonts?.main) {
              cssVariables['--font-main'] = themeDef.fonts.main;
            }
            
            config.themes[themeDef.name] = {
              definition: themeDef,
              cssVariables
            };
          }
        } catch (e) {
          console.error(`Error parsing theme file ${file}:`, e);
        }
      }
    }
  } catch (e) {
    console.error('Failed to load themes:', e);
  }

  // Ensure default theme exists or pick the first one
  if (!config.themes[config.defaultTheme] && Object.keys(config.themes).length > 0) {
    config.defaultTheme = Object.keys(config.themes)[0];
  }

  cachedThemeConfig = config;
  return config;
}
