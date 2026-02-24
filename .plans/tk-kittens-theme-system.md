**Status:** Complete ✅

# Plan: Kittens Hierarchical Theme System

## 1. Directory Structure & Storage ✅
Themes will be discovered dynamically from a new directory.
- **Path:** `.apps/kittens/themes/`
- **Files:** `montessori.yml` (default), `dracula.yml`, etc.

## 2. Hierarchical YAML Schema ✅
Each theme file enforces a strict separation between the color palette (`colors`) and the usage of those colors (`semantics`, `fonts`, `mascots`).

```yaml
# themes/dracula.yml
name: "dracula"
label: "Dracula Theme"

# 1. Named Palette (Only 6-digit Hex allowed for this iteration)
colors:
  background: "#282a36"
  foreground: "#f8f8f2"
  purple: "#bd93f9"

# 2. Semantics (Hierarchical)
semantics:
  background: background # References 'background' from colors
  foreground: foreground
  primary:
    DEFAULT: purple
    foreground: foreground
  headers:
    color: foreground    # Applies to all headers by default
    h1:
      color: purple      # Overrides h1 specifically

# 3. Mascots (Hierarchical overrides)
mascots:
  header: ['concerned-chemist']
  callouts:
    tip: ['shows-book']
```

## 3. Theme Parser Engine & CSS Generation (`src/lib/theme-parser.ts`) ✅
1. **Alias Resolution:** When parsing `semantics`, the engine looks up values in the `colors` dictionary.
2. **Hex to HSL Conversion:** Converts `#RRGGBB` into the `H S% L%` format required by shadcn and Tailwind.
3. **Hierarchy Flattening:** Recursively flattens the `semantics` object into CSS custom properties (e.g., `semantics.headers.h1.color` ➔ `--headers-h1-color`).
4. **Dynamic Styles:** The `<ThemeStyles />` component injects these generated variables into `<style>` blocks scoped to `[data-theme="dracula"]`.

## 4. Tailwind Config & Fallback Chains (`tailwind.config.ts`) ✅
Map the flattened CSS variables using CSS fallback chains.
Example for typography plugin:
```typescript
h1: { 
  color: 'hsl(var(--headers-h1-color, var(--headers-color, var(--foreground))))' 
}
```

## 5. Theme Linter (`scripts/lint-themes.ts`) ✅
A standalone script (runnable via `npm run theme:lint`) that performs static analysis on YAML files in `themes/`.
- **Reporting Only (Iteration 1):** Reports violations without auto-fixing.
- **Rule 1 (Reference Check):** Scans the `semantics` section. If it finds a hardcoded 6-digit hex string, it checks the `colors` dictionary. If a match exists, it suggests replacing the hex with the named reference.
- **Rule 2 (Duplication Check):** If a hardcoded hex string is used multiple times across `semantics` and does *not* exist in `colors`, it flags it and suggests creating a named color for it.

## 6. Server-Side Mascot Theme Overrides ✅
- Update `src/app/api/lessons/[slug]/route.ts` to parse a `theme` query parameter.
- Pass `theme` down to `parseMarkdownToSlides` and `resolveKittenForSlide`.
- Override default mascots based on `mascots` defined in the active theme's YAML.

## 7. UI: Theme Picker & Dynamic Re-fetching ✅
- Update `<LessonLoader />` (`src/app/page.tsx`) to use `next-themes`' `useTheme` and include `resolvedTheme` in the `/api/lessons/` fetch call.
- Create a `<ThemePicker />` component to allow runtime theme selection by the user.
