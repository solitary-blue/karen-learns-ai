'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { Palette, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

const THEMES = [
  { id: 'montessori', label: 'Montessori Classic' },
  { id: 'dracula', label: 'Dracula' },
  { id: 'midnight-montessori', label: 'Midnight Montessori' },
  { id: 'dusk-gradient', label: 'Dusk Gradient' },
  { id: 'parchment-ink', label: 'Parchment & Ink' },
  { id: 'sunlit-studio', label: 'Sunlit Studio' },
  { id: 'nordic-frost', label: 'Nordic Frost' },
];

export function ThemePicker() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="p-2 rounded-full text-foreground opacity-[0.15] hover:opacity-80 transition-opacity duration-300"
            aria-label="Choose theme"
          >
            <Palette size={24} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" className="min-w-[180px]">
          {THEMES.map(t => (
            <DropdownMenuItem
              key={t.id}
              onClick={() => setTheme(t.id)}
              className="flex items-center justify-between cursor-pointer"
            >
              <span>{t.label}</span>
              {theme === t.id && <Check size={16} className="text-primary" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
