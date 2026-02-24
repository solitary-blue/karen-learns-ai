# Add Kitten Mascots to Slides

**Status:** Complete ✅

## Context

The kittens app is a Next.js slide deck presentation tool. We want to add kitten mascot images to slides in two scenarios: (1) header-only slides get a large kitten, (2) callout-dominant slides get a smaller kitten. Kitten preferences are configured per-callout-type. Images live in `assets/kittens/`, served via an API route (matching the existing font proxy pattern). Detection happens on raw markdown server-side; the resolved kitten is passed to the client as part of the `Slide` type.

Eight kitten PNGs exist in `assets/adobe-express-transparent/` — they'll be copied to the canonical `assets/kittens/` directory. Short names strip the `kitty-` prefix: `kitty-suit-arms-crossed.png` → `suit-arms-crossed`.

---

## Scope Fence

**DO NOT:**
- Modify any existing test
- Refactor, reformat, or add comments/types to unchanged code
- Touch files not listed below
- Delete anything

**DO:**
- Run tests after each phase
- Keep all 31 existing tests green throughout

---

## Phase 1: Foundation (new files only, zero changes to existing code) ✅

### 1.1 Copy kitten images

```bash
cp .apps/kittens/assets/adobe-express-transparent/kitty-*.png .apps/kittens/assets/kittens/
```

Result: 8 PNGs in `.apps/kittens/assets/kittens/`.

### 1.2 Create `.apps/kittens/app-config.yml`

```yaml
kitten-size: 280px
callout-kitten-size: 180px
kitten-min-other-lines: 3
```

### 1.3 Create `.apps/kittens/src/lib/kitten-config.ts`

Three responsibilities — load app config, discover kitten files, resolve/pick kittens.

- `import 'server-only'` (matches `callout-config.ts` pattern)
- Module-level singleton cache (same pattern as `callout-config.ts`)
- Exports:
  - `loadAppConfig(): AppConfig` — reads `app-config.yml`, merges over defaults, caches
  - `discoverKittens(): KittenInfo[]` — reads `assets/kittens/` dir, strips `kitty-` prefix for short names, caches
  - `resolveKitten(name: string): KittenInfo | null` — lookup by short name
  - `pickRandomKitten(): KittenInfo | null` — random from discovered set
  - `pickKittenFromPreferences(prefs: string | string[]): KittenInfo | null` — tries each name in order; logs `console.warn` and skips invalid ones; returns `null` if all invalid (no random fallback — the caller decides)
- Types: `AppConfig`, `KittenInfo { name: string; filePath: string }`
- Defaults: `kitten-size: '280px'`, `callout-kitten-size: '180px'`, `kitten-min-other-lines: 3`

### 1.4 Create `.apps/kittens/src/lib/kitten-config.test.ts`

12 tests across 4 describe blocks:
- `loadAppConfig`: defaults when no file, merges file over defaults, caches after first load
- `discoverKittens`: empty when dir missing, strips kitty- prefix, ignores non-PNG
- `resolveKitten`: valid name returns info, unknown returns null
- `pickKittenFromPreferences`: picks first valid from array, handles single string, returns null when all invalid

Uses `vi.resetModules()` + dynamic `import()` in `beforeEach` to reset module-level caches between tests. Mock `fs.existsSync`, `fs.readFileSync`, `fs.readdirSync`.

**Checkpoint: run `npm test` — 12 new + 31 existing = 43 pass**

### 1.5 Create `.apps/kittens/src/app/api/kittens/[name]/route.ts`

Follows pattern from `src/app/api/fonts/proxy/route.ts`.

- `GET` handler with `params: Promise<{ name: string }>` (Next.js 15 pattern)
- Validate name: `/^[a-z0-9-]+$/` → 400 if invalid
- `resolveKitten(name)` → 404 if null
- Read file with `fs.readFileSync(kitten.filePath)`
- Return with `Content-Type: image/png`, `Cache-Control: public, max-age=31536000, immutable`
- Catch read errors → 500

### 1.6 Create `.apps/kittens/src/app/api/kittens/[name]/route.test.ts`

3 tests: 400 for invalid name, 404 for unknown name, 200 with correct headers for valid name. Mock `@/lib/kitten-config` with `vi.mock`.

**Checkpoint: run `npm test` — 46 tests pass**

---

## Phase 2: Callout Config Extension (3 tiny additive changes) ✅

### 2.1 `src/lib/callout-config.ts` — add 1 line to interface

```typescript
// Add after aliases?: string[];
kittens?: string | string[];
```

No other changes to this file. The loader already passes through all YAML keys via `callouts[entry.type] = entry`.

### 2.2 `schemas/callouts-config.schema.json` — add property

Add inside `items.properties`, after `aliases`:

```json
"kittens": {
  "oneOf": [
    { "type": "string" },
    { "type": "array", "items": { "type": "string" } }
  ],
  "description": "Preferred kitten mascot name(s) for this callout type"
}
```

### 2.3 `callouts-config.yml` — add `kittens` to a few entries

Add `kittens` field to these existing entries only (append the line, don't rewrite the entry):
- `tip`: `kittens: [proud-book, shows-book]`
- `warning`: `kittens: concerned-chemist`
- `success`: `kittens: excited-chemist`
- `example`: `kittens: suit-arms-crossed`

**Checkpoint: run `npm test` — still 46 tests pass**

---

## Phase 3: Slide Analysis and Kitten Injection ✅

### 3.1 `src/lib/types.ts` — extend `Slide`

Add optional field:

```typescript
export interface Slide {
  html: string;
  title: string;
  hideTitle: boolean;
  kitten?: {
    name: string;
    height: string;
  };
}
```

### 3.2 `src/test/fixtures.ts` — append kitten fixtures

APPEND after the existing `TEST_CALLOUT_CONFIG` (do not modify anything above):

```typescript
export const HEADER_ONLY_SLIDE = '# Welcome to the Lesson';
export const HEADER_ONLY_WITH_BLANKS = '# Welcome\n\n\n';
export const MULTI_HEADING_SLIDE = '# Main Title\n\n## Subtitle';  // NOT header-only

export const CALLOUT_DOMINANT_SLIDE = '# Tips\n\n> [!tip]\n> Remember to breathe.';
export const CALLOUT_WITH_EXTRA_CONTENT =
  '# Tips\n\n> [!tip]\n> Remember to breathe.\n\nExtra line one.\nExtra line two.\nExtra line three.';
export const NORMAL_CONTENT_SLIDE = '# Regular Slide\n\nThis is a paragraph.\n\nAnother paragraph.';
export const WARNING_CALLOUT_SLIDE = '# Caution\n\n> [!warning]\n> Be careful with this.';
```

### 3.3 `src/lib/markdown.ts` — add analysis + injection

Add imports at top:

```typescript
import { loadAppConfig, pickRandomKitten, pickKittenFromPreferences } from './kitten-config';
import { loadCalloutConfig } from './callout-config';  // already imported indirectly via remark-callout, but needed directly now
```

Add **exported** helper function `analyzeSlideContent(rawMarkdown: string): SlideAnalysis`:

- `isHeaderOnly`: exactly one non-blank line exists and it matches `/^#+\s/` (single heading, nothing else). Multi-heading slides are NOT header-only.
- `isCalloutDominant`: slide has a callout (`/^>\s*\[!([a-zA-Z0-9+-]+)\]/m`), and "other" lines (not heading, not blockquote `^>`, not blank) are fewer than `loadAppConfig()['kitten-min-other-lines']`
- `calloutType`: extracted from the regex match, lowercased

Add private helper `resolveKittenForSlide(analysis: SlideAnalysis)`:

- If `isHeaderOnly` → `pickRandomKitten()`, use `kitten-size`
- If `isCalloutDominant` → look up `loadCalloutConfig().callouts[calloutType]?.kittens`. If the callout type has a `kittens` preference, use `pickKittenFromPreferences(...)`. If no `kittens` preference is configured, return `undefined` (no kitten). Use `callout-kitten-size` for height.
- Returns `{ name, height } | undefined`

Modify `parseMarkdownToSlides` map callback — after computing `title`/`hideTitle`, call `analyzeSlideContent(content)` and `resolveKittenForSlide(analysis)`, spread `kitten` into the returned object if defined.

**Important:** `loadCalloutConfig` is already imported by `remark-callout.ts` (which `markdown.ts` uses as a plugin). The new direct import in `markdown.ts` is fine — it hits the same singleton cache.

### 3.4 `src/lib/markdown.test.ts` — append kitten tests

Add `vi.mock('./kitten-config', ...)` at the top level (alongside the existing `vi.mock('./callout-config', ...)`):

```typescript
vi.mock('./kitten-config', () => ({
  loadAppConfig: () => ({
    'kitten-size': '280px',
    'callout-kitten-size': '180px',
    'kitten-min-other-lines': 3,
  }),
  pickRandomKitten: () => ({ name: 'suit-arms-crossed', filePath: '/fake/path.png' }),
  pickKittenFromPreferences: (prefs: string | string[]) => ({
    name: Array.isArray(prefs) ? prefs[0] : prefs,
    filePath: '/fake/path.png',
  }),
}));
```

Add import for new fixtures. APPEND two new describe blocks:

**`describe('analyzeSlideContent', ...)` — 6 tests:**
- header-only (single heading) → `isHeaderOnly: true`
- header-only with blank lines → `isHeaderOnly: true`
- multi-heading slide → `isHeaderOnly: false` (only single heading counts)
- callout-dominant → `isCalloutDominant: true`, `calloutType: 'tip'`
- callout with too many extra lines → `isCalloutDominant: false`
- normal content → both false

**`describe('parseMarkdownToSlides kitten injection', ...)` — 4 tests:**
- header-only slide → `kitten` defined, `height === '280px'`
- callout-dominant slide with `kittens` preference (tip) → `kitten` defined, `height === '180px'`
- callout-dominant slide WITHOUT `kittens` preference (note) → `kitten` undefined (no random fallback)
- normal content slide → `kitten` undefined

For the "no preference" test, use a fixture like `'# Notes\n\n> [!note]\n> Some note.'` — the `note` callout type has no `kittens` field in the mock config.

**Note:** The existing mock for `./callout-config` already provides the `note` and `tip` types needed. The existing 8 tests in the first `describe` block are untouched and will still pass — none of the existing test inputs are header-only or would have their assertions broken by an extra `kitten` field.

**Checkpoint: run `npm test` — 56 tests pass (46 + 10 new)**

---

## Phase 4: Client Rendering ✅

### 4.1 `src/components/SlideShow.tsx` — render kitten image

Add a new `AnimatePresence` block as a direct child of the outermost `div.relative.w-full.h-screen`, placed between the slide content wrapper (after line 115) and the Sheet sidebar (line 118):

```tsx
{/* Kitten Mascot */}
<AnimatePresence mode="wait">
  {slides[current].kitten && (
    <motion.img
      key={`kitten-${current}`}
      src={`/api/kittens/${slides[current].kitten!.name}`}
      alt=""
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.8, y: 20 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
      className="absolute bottom-28 right-8 z-30 pointer-events-none"
      style={{ height: slides[current].kitten!.height, width: 'auto' }}
    />
  )}
</AnimatePresence>
```

- `absolute bottom-28 right-8`: above the progress dot (`bottom-8 right-8`) and bottom nav zone (`h-24`)
- `z-30`: below ghost nav zones (`z-40`) so it never blocks clicks
- `pointer-events-none`: can't intercept clicks
- Separate `AnimatePresence` from the slide content one — avoids interfering with `mode="wait"` on slide transitions
- `delay: 0.2`: kitten appears slightly after slide content, playful entrance

**No new imports needed** — `AnimatePresence` and `motion` are already imported.

---

## Files Summary

### New (6 files + 8 images)
| File | Tests |
|------|-------|
| `.apps/kittens/assets/kittens/*.png` | — |
| `.apps/kittens/app-config.yml` | — |
| `src/lib/kitten-config.ts` | 12 |
| `src/app/api/kittens/[name]/route.ts` | 3 |

### Modified (8 files)
| File | Change |
|------|--------|
| `src/lib/callout-config.ts` | 1 line: add `kittens?` to interface |
| `schemas/callouts-config.schema.json` | ~7 lines: add `kittens` property |
| `callouts-config.yml` | 4 lines: add `kittens` to tip/warning/success/example |
| `src/lib/types.ts` | 4 lines: add `kitten?` to `Slide` |
| `src/test/fixtures.ts` | ~10 lines appended: kitten test fixtures |
| `src/lib/markdown.ts` | ~70 lines added: analysis functions + injection in map callback |
| `src/lib/markdown.test.ts` | ~60 lines appended: 10 new tests + kitten-config mock |
| `src/components/SlideShow.tsx` | ~15 lines: kitten `AnimatePresence` block |

### Total new tests: 25

---

## Verification

After all steps:

```bash
cd .apps/kittens && npm run check
```

This runs lint → typecheck → test → build. All must pass.

Manual verification:
1. Start dev server: `npm run dev`
2. Load a lesson with a header-only slide (just a `# Heading` and nothing else) — kitten should appear bottom-right at 280px
3. Load a lesson with a callout-dominant slide (`> [!tip]` with minimal other content) — smaller kitten at 180px
4. Verify that slides with regular paragraph content show no kitten
5. Check server logs for any kitten resolution warnings
