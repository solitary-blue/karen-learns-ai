'use client';

import { ThemeProvider as NextThemesProvider } from "next-themes";

const ALL_THEMES = [
  'montessori',
  'dracula',
  'midnight-montessori',
  'dusk-gradient',
  'parchment-ink',
  'sunlit-studio',
  'nordic-frost',
];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme="montessori"
      themes={ALL_THEMES}
      enableSystem={false}
    >
      {children}
    </NextThemesProvider>
  );
}
