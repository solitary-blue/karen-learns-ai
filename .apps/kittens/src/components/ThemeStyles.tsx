import 'server-only';
import { loadThemeConfig } from '@/lib/theme-parser';

export default function ThemeStyles() {
  const config = loadThemeConfig();
  
  if (!config || !config.themes) return null;

  let cssString = '';

  for (const [themeName, themeData] of Object.entries(config.themes)) {
    const selector = themeName === config.defaultTheme 
      ? `:root, [data-theme="${themeName}"]` 
      : `[data-theme="${themeName}"]`;
      
    cssString += `${selector} {\n`;
    
    for (const [key, value] of Object.entries(themeData.cssVariables)) {
      if (key.startsWith('--font')) {
        cssString += `  ${key}: ${value};\n`;
      } else {
        cssString += `  ${key}: ${value};\n`;
      }
    }
    
    cssString += `}\n\n`;
  }

  return (
    <style dangerouslySetInnerHTML={{ __html: cssString }} />
  );
}
