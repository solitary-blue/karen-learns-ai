'use client';

import * as React from 'react';
import { Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useSettings, FontOption } from '@/hooks/use-settings';

// Initial safe defaults
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

export function SettingsMenu() {
  const [availableMainFonts, setAvailableMainFonts] = React.useState<FontOption[]>(DEFAULT_MAIN_FONTS);
  const [availableTitleFonts, setAvailableTitleFonts] = React.useState<FontOption[]>(DEFAULT_TITLE_FONTS);
  
  const { mainFont, titleFont, updateMainFont, updateTitleFont } = useSettings(DEFAULT_MAIN_FONTS[0], DEFAULT_TITLE_FONTS[0]);

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

  const uiFontStyle = { fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' };

  return (
    <div className="fixed top-6 right-6 z-50">
      <Sheet>
        <SheetTrigger asChild>
          <button
            className="p-2 rounded-full hover:bg-black/5 text-foreground/40 hover:text-foreground transition-colors opacity-0 hover:opacity-100 transition-opacity duration-300"
          >
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
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
