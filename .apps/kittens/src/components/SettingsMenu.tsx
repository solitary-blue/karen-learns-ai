'use client';

import * as React from 'react';
import { Settings, Check } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useSettings, FontOption } from '@/hooks/use-settings';
import { WeightPicker } from '@/components/WeightPicker';
import { useTheme } from 'next-themes';

const DEFAULT_MAIN_FONTS = [
  { name: 'Avenir Next', value: '"Avenir Next", Avenir, "Seravek", system-ui, sans-serif' },
  { name: 'Helvetica', value: 'Helvetica, "Helvetica Neue", Arial, sans-serif' },
  { name: 'Arial', value: 'Arial, sans-serif' },
];

const DEFAULT_TITLE_FONTS = [
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Baskerville', value: 'Baskerville, "Baskerville Old Face", serif' },
  { name: 'Times New Roman', value: '"Times New Roman", Times, serif' },
];

const THEMES = [
  { id: 'montessori', label: 'Montessori Classic' },
  { id: 'dracula', label: 'Dracula' },
  { id: 'midnight-montessori', label: 'Midnight Montessori' },
  { id: 'dusk-gradient', label: 'Dusk Gradient' },
  { id: 'parchment-ink', label: 'Parchment & Ink' },
  { id: 'sunlit-studio', label: 'Sunlit Studio' },
  { id: 'nordic-frost', label: 'Nordic Frost' },
];

export function SettingsMenu() {
  const [availableMainFonts, setAvailableMainFonts] = React.useState<FontOption[]>(DEFAULT_MAIN_FONTS);
  const [availableTitleFonts, setAvailableTitleFonts] = React.useState<FontOption[]>(DEFAULT_TITLE_FONTS);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  const { mainFont, titleFont, updateMainFont, updateTitleFont, updateMainFontWeight, updateTitleFontWeight } = useSettings(DEFAULT_MAIN_FONTS[0], DEFAULT_TITLE_FONTS[0]);

  React.useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    async function loadFonts() {
      try {
        const res = await fetch('/api/fonts');
        if (res.ok) {
          const data = await res.json();
          if (data.mainFonts && data.mainFonts.length > 0) {
            setAvailableMainFonts(data.mainFonts);
          }
          if (data.titleFonts && data.titleFonts.length > 0) {
            setAvailableTitleFonts(data.titleFonts);
          }
        }
      } catch (e) {
        console.error('Failed to load font config', e);
      }
    }
    loadFonts();
  }, []);

  const selectedMainFont = availableMainFonts.find((font) => font.name === mainFont.name) || mainFont;
  const selectedTitleFont = availableTitleFonts.find((font) => font.name === titleFont.name) || titleFont;

  const uiFontStyle = { fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' };

  return (
    <div className="fixed top-6 right-6 z-50">
      <Sheet>
        <SheetTrigger asChild>
          <button className="p-2 rounded-full text-foreground opacity-[0.15] hover:opacity-80 transition-opacity duration-300">
            <Settings size={24} />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80">
          <SheetHeader>
            <SheetTitle className="text-xl font-serif text-primary" style={uiFontStyle}>
              Appearance
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-6 mt-8">
            {mounted && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground block" style={uiFontStyle}>Theme</label>
                <div className="space-y-1">
                  {THEMES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-muted text-foreground text-sm transition-colors"
                      style={uiFontStyle}
                    >
                      <span>{t.label}</span>
                      {theme === t.id && <Check size={16} className="text-primary" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground block" style={uiFontStyle}>Main Font</label>
              <select
                className="w-full text-base bg-transparent border border-border rounded-md shadow-sm focus:border-primary focus:ring-1 focus:ring-primary p-2 text-foreground"
                style={uiFontStyle}
                value={mainFont.name}
                onChange={(e) => {
                  const font = availableMainFonts.find(f => f.name === e.target.value);
                  if (font) updateMainFont(font);
                }}
              >
                {availableMainFonts.map(f => (
                  <option key={f.name} value={f.name}>{f.name}</option>
                ))}
              </select>
              <WeightPicker
                fontName={mainFont.name}
                availableWeights={selectedMainFont.availableWeights}
                selectedWeight={mainFont.weight || 400}
                onWeightChange={updateMainFontWeight}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground block" style={uiFontStyle}>Title Font</label>
              <select
                className="w-full text-base bg-transparent border border-border rounded-md shadow-sm focus:border-primary focus:ring-1 focus:ring-primary p-2 text-foreground font-serif"
                style={uiFontStyle}
                value={titleFont.name}
                onChange={(e) => {
                  const font = availableTitleFonts.find(f => f.name === e.target.value);
                  if (font) updateTitleFont(font);
                }}
              >
                {availableTitleFonts.map(f => (
                  <option key={f.name} value={f.name}>{f.name}</option>
                ))}
              </select>
              <WeightPicker
                fontName={titleFont.name}
                availableWeights={selectedTitleFont.availableWeights}
                selectedWeight={titleFont.weight || 400}
                onWeightChange={updateTitleFontWeight}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
