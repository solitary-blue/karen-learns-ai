# Kittens Authoring Guide (Non-Technical)

This guide explains how to write lesson files so they work in two places:

- As normal Markdown notes (readable anywhere)
- As slide lessons inside Kittens

## The Big Idea

Write as if Kittens did not exist.

Then add only the smallest amount needed for slides.

## What To Use (Safe, Standard Markdown)

- Headings: `#`, `##`, `###`
- Paragraphs and lists
- Links and images
- Blockquotes
- Horizontal rule: `---`

These are standard Markdown features and stay readable in almost every tool.

## Slide Breaks

Kittens turns one Markdown file into slides by splitting on:

```markdown
---
```

This is standard Markdown (a horizontal rule), so it is still fine in normal note apps.

## Lesson Metadata (Obsidian-Style Frontmatter)

If you want lesson details (age band, duration, tags), place YAML frontmatter at the top of the file.

```markdown
---
title: Great Lesson 1
aliases:
  - Coming of the Universe
tags:
  - montessori
  - lower-elementary
duration_minutes: 45
audience: Lower Elementary
materials:
  - Timeline cards
  - Globe
---
```

Notes:

- This follows the same style Obsidian uses.
- Kittens reads and displays metadata in the lesson overview.
- If frontmatter is missing or broken, Kittens still opens the lesson body normally.

## Custom Syntax Policy (Keep It Minimal)

Kittens currently supports two extras. Use them only when they solve a real teaching need.

1. Hidden slide title:

```markdown
## .Internal title for presenter
```

Kittens uses the title for navigation but hides it on the slide.

2. Obsidian-style callouts (optional):

```markdown
> [!note] Montessori link
> This is important context.
```

Because this syntax is also recognized by Obsidian, it is considered acceptable and portable enough for this project.

## Quick Quality Check (Before You Present)

Open the Markdown file in a plain editor and ask:

- Can I read it linearly from top to bottom?
- Do slide breaks (`---`) still make sense as section separators?
- If Kittens-specific features are removed, does the lesson still teach clearly?

If the answer is yes, the lesson is in good shape.

## One Tiny Example

```markdown
# What Is AI?

AI is software that can help us think, write, and organize.

---

## Classroom Example

Use AI to draft three versions of a lesson opening.

> [!tip] Keep agency with the guide
> Ask AI for options, then choose deliberately.
```
