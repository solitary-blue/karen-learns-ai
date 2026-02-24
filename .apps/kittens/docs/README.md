# Kittens — Developer Guide

A Montessori-themed lesson slideshow viewer.

## Tech Stack

- **Next.js 16** (App Router) + **React 19**
- **Tailwind CSS 3.4** — custom Montessori color palette
- **Framer Motion** — slide transitions and sidebar animation
- **unified / remark / rehype** — Markdown-to-HTML pipeline

## Architecture

```
src/
├── app/
│   ├── api/lessons/[slug]/route.ts   # Serves lesson markdown from filesystem
│   ├── globals.css                    # Tailwind directives + base styles
│   ├── layout.tsx                     # Root layout
│   └── page.tsx                       # Client component — fetches & renders lesson
├── components/
│   └── SlideShow.tsx                  # Slide viewer with keyboard nav + ghost UI
└── lib/
    ├── frontmatter.ts                 # Parses Obsidian-style YAML frontmatter
    ├── markdown.ts                    # Splits markdown on --- into Slide[]
    ├── types.ts                       # Shared Slide interface
    └── utils.ts                       # cn() — clsx + tailwind-merge
```

## Getting Started

```bash
cd .apps/kittens
npm install
npm run dev          # → http://localhost:3000
```

Open with a specific lesson: `http://localhost:3000?lesson=03_llm_memory_KAREN`

## How Lessons Work

1. `page.tsx` reads the `?lesson=` query param (default: `03_llm_memory_KAREN`)
2. Fetches `/api/lessons/{slug}` — the API route reads `{slug}.md` from the curriculum directory
3. `parseMarkdownToSlides()` splits the markdown on `\n---\n` horizontal rules
4. Each section becomes a `Slide` with `html`, `title` (first heading), and `hideTitle` flag

### Obsidian-Style Frontmatter

Kittens supports YAML frontmatter at the top of lesson files, matching Obsidian conventions.

- Parsed by `parseLessonFrontmatter()`
- Included in API response as `metadata`
- Rendered in the slide overview sidebar as "Lesson Details"
- Fail-open behavior: malformed frontmatter is ignored and lesson body still renders

### Curriculum Directory

By default resolves to `../../curriculum` relative to the app's `cwd`. Override with the `CURRICULUM_DIR` environment variable.

### Slide Format (Markdown)

```markdown
# Slide Title

Content for the first slide.

---

# Second Slide

More content here.

---

## .Hidden Title

Prefix a heading with `.` to set `hideTitle: true`.
```

## Design System

| Token | Value | Usage |
|---|---|---|
| `montessori-cream` | `#F5F1E8` | Page background |
| `montessori-gold` | `#D4A574` | Accents, headings, progress |
| `montessori-charcoal` | `#2C2C2C` | Body text |
| `font-serif` | Georgia stack | Headings (h1–h4) |
| `font-sans` | system-ui stack | Body text |

## Ghost UI

Navigation controls are invisible by default and appear on hover — keeping the reading surface clean.

- **Top edge hover** — shows "Previous" label + preceding slide title
- **Bottom edge hover** — shows "Next" label + following slide title
- **Top-left corner** — slide list icon, opens sidebar overlay
- **Arrow keys** — Left/Up = previous, Right/Down = next, Escape = close sidebar
- **Bottom-right** — subtle `n / total` progress counter (always visible at low opacity)
