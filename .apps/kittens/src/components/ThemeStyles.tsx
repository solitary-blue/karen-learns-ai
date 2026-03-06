import 'server-only';
import { loadThemeConfig } from '@/lib/theme-parser';

export default function ThemeStyles() {
  const config = loadThemeConfig();

  if (!config || !config.themes) return null;

  let cssString = '';

  // 1. First, render the default theme as :root to provide the baseline variables
  const defaultTheme = config.themes[config.defaultTheme];
  if (defaultTheme) {
    cssString += `:root {\n`;
    for (const [key, value] of Object.entries(defaultTheme.cssVariables)) {
      cssString += `  ${key}: ${value};\n`;
    }
    cssString += `}\n\n`;
  }

  // 2. Then, render each theme with its specific attribute selector.
  // This ensures that any theme selected via [data-theme] will override the :root baseline
  // regardless of the order they appear in config.themes.
  for (const [themeName, themeData] of Object.entries(config.themes)) {
    cssString += `[data-theme="${themeName}"] {\n`;
    for (const [key, value] of Object.entries(themeData.cssVariables)) {
      cssString += `  ${key}: ${value};\n`;
    }
    cssString += `}\n\n`;
  }

  // 3. Collect all unique Google Font URLs across themes
  const googleFontSpecs = new Set<string>();
  for (const themeData of Object.values(config.themes)) {
    if (themeData.definition.googleFonts) {
      googleFontSpecs.add(themeData.definition.googleFonts);
    }
  }

  const googleFontLinks = [...googleFontSpecs].map(spec =>
    `https://fonts.googleapis.com/css2?family=${spec}&display=swap`
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cssString }} />
      {googleFontLinks.map(href => (
        <link key={href} rel="stylesheet" href={href} />
      ))}
    </>
  );
}
