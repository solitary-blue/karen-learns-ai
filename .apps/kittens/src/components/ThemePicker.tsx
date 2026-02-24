'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemePicker() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering the UI after the component has mounted on the client
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return null;
  }

  // We explicitly map available themes we know exist to avoid relying purely on next-themes cache
  const availableThemes = ['montessori', 'dracula'];

  return (
    <div className="fixed bottom-4 left-4 z-50 flex gap-2 p-2 bg-background/80 backdrop-blur-md border border-border rounded-lg shadow-sm">
      {availableThemes.map((t) => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
            theme === t
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          }`}
        >
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </button>
      ))}
    </div>
  );
}
