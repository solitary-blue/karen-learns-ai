import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { hexToHsl, loadThemeConfig } from './theme-parser';
import yaml from 'js-yaml';

vi.mock('fs');

describe('hexToHsl', () => {
  it('converts 6-digit hex correctly', () => {
    expect(hexToHsl('#ffffff')).toBe('0 0% 100%');
    expect(hexToHsl('#000000')).toBe('0 0% 0%');
    expect(hexToHsl('#ff0000')).toBe('0 100% 50%');
  });

  it('converts 3-digit hex correctly', () => {
    expect(hexToHsl('#fff')).toBe('0 0% 100%');
    expect(hexToHsl('#000')).toBe('0 0% 0%');
    expect(hexToHsl('#f00')).toBe('0 100% 50%');
  });

  it('works without hash', () => {
    expect(hexToHsl('ffffff')).toBe('0 0% 100%');
  });
});

describe('loadThemeConfig', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Reset the cachedThemeConfig module-level variable
    vi.resetModules();
  });

  it('parses themes directory and resolves semantics to HSL', async () => {
    // Re-import after resetting modules to get a fresh cache
    const { loadThemeConfig } = await import('./theme-parser');

    const mockThemesDir = '/mock/themes';
    vi.spyOn(process, 'cwd').mockReturnValue('/mock');
    vi.spyOn(path, 'join').mockImplementation((...args: any[]) => args.join('/'));
    
    (fs.existsSync as any).mockReturnValue(true);
    (fs.readdirSync as any).mockReturnValue(['test-theme.yml'] as any);
    
    const mockYaml = `
name: test-theme
label: Test Theme
colors:
  red: "#ff0000"
  blue: "#0000ff"
  ink: "#111827"
semantics:
  background: "#ffffff"
  primary:
    DEFAULT: red
    foreground: blue
components:
  bullets:
    color: red
    shadow: "0 0 8px rgba(255, 0, 0, 0.35)"
  callouts:
    titleBackground: "rgba(17, 24, 39, 0.35)"
    types:
      info:
        surface: "rgba(0, 0, 255, 0.12)"
        border: blue
        title: red
fonts:
  title: "Test Serif"
    `;
    
    (fs.readFileSync as any).mockReturnValue(mockYaml);

    const config = loadThemeConfig();

    expect(config.defaultTheme).toBe('test-theme');
    expect(config.themes['test-theme']).toBeDefined();
    
    const cssVars = config.themes['test-theme'].cssVariables;
    
    // Direct hex in semantics
    expect(cssVars['--background']).toBe('0 0% 100%'); // #ffffff
    
    // Aliased colors in semantics
    expect(cssVars['--primary']).toBe('0 100% 50%'); // red -> #ff0000
    expect(cssVars['--primary-foreground']).toBe('240 100% 50%'); // blue -> #0000ff
    
    // Fonts
    expect(cssVars['--font-title']).toBe('Test Serif');

    // Component tokens
    expect(cssVars['--bullets-color']).toBe('#ff0000');
    expect(cssVars['--bullets-shadow']).toBe('0 0 8px rgba(255, 0, 0, 0.35)');
    expect(cssVars['--callouts-title-background']).toBe('rgba(17, 24, 39, 0.35)');
    expect(cssVars['--callouts-types-info-surface']).toBe('rgba(0, 0, 255, 0.12)');
    expect(cssVars['--callouts-types-info-border']).toBe('#0000ff');
    expect(cssVars['--callouts-types-info-title']).toBe('#ff0000');
  });
});
