---
name: kittens-slideshow
description: Create slideshows for the kittens presentation app. Use when asked to make a slideshow, build a presentation, create slides, or make a lesson. Trigger phrases include "make a slideshow", "build a slideshow", "create a presentation", "make slides", "build a lesson".
---

# Kittens Slideshow Creator

Create markdown slideshows that render in the kittens presentation app (`.apps/kittens`).

## When to Use

- User asks to "make a slideshow", "build a slideshow", "create a presentation"
- User asks to "make slides" or "create slides"
- User asks to "build a lesson" (without specifying "for Karen" — that triggers lesson-for-karen instead)
- User wants to present information in slide format

## File Location

Slideshows are markdown files. Ask the user where to save it if not specified. Common locations:

- `workspace/` — for practice slideshows and experiments
- `curriculum/<section>/` — for curriculum content (use lesson-for-karen skill for formal lessons)

Use a descriptive kebab-case filename ending in `.md`, e.g. `workspace/kittens-facts.md` or `workspace/my-first-slideshow.md`.

## Slideshow Format

### Frontmatter

Every slideshow starts with YAML frontmatter:

```yaml
---
title: "Slideshow Title"
tags:
  - tag1
  - tag2
---
```

### Slides

Slides are separated by `---` on its own line (with blank lines above and below):

```markdown
---
title: "My Slideshow"
---

# My Slideshow

Introduction text.

---

## Slide Heading

Content for this slide.

---

## Another Slide

More content here.
```

### Hidden Headings

A `.` prefix on a heading hides the title on that slide (useful for visual/diagram slides):

```markdown
## . Hidden Heading

![Some Image](path/to/image.png)
```

### Callouts

Use Obsidian-style callouts for emphasis:

| Type | Use For |
|------|---------|
| `[!NOTE]` | Key information, definitions |
| `[!TIP]` | Practical advice, shortcuts |
| `[!WARNING]` | Common mistakes, pitfalls |
| `[!SUCCESS]` | Celebrations, achievements |
| `[!QUESTION]` | Questions for the audience |
| `[!EXAMPLE]` | Worked examples |
| `[!INFO]` | Background context |
| `[!QUOTE]` | Quotes from sources |

Syntax:
```markdown
> [!TIP] Practical Tip
> This is a helpful tip!
```

### Kittens (Mascots)

The kittens app shows kitten mascots on slides in two ways:

1. **Header-only slides** (a single heading with no other content) automatically get a random kitten.
2. **Callouts with kittens configured** render a kitten inside the callout box:

| Callout Type | Kitten |
|---|---|
| `[!TIP]` | proud-book, shows-book |
| `[!SUCCESS]` | excited-chemist |
| `[!WARNING]` | concerned-chemist |
| `[!EXAMPLE]` | suit-arms-crossed |

**Guidelines:**
- Aim for **4-6 slides with kittens** per slideshow — enough to feel lively, not overwhelming.
- Vary the callout types so the same kitten doesn't repeat.
- Don't add callouts just for the kitten — every callout should highlight genuinely useful information.

## Workflow

### 1. Clarify the Request

If the user's request is clear (topic, rough content), proceed. Otherwise ask:

- **What's the topic?** — What should the slideshow be about?
- **How many slides?** — Default to 8-15 slides if not specified.
- **Where to save it?** — Suggest `workspace/` for practice, or ask for a specific path.

### 2. Create the First Slide

The title slide should be a header-only slide (which gets a kitten automatically):

```markdown
---
title: "Topic Title"
tags:
  - topic-tag
---

# Topic Title
```

### 3. Build the Content

Create slides following a natural arc:

1. **Opening** (1-2 slides) — Title and introduction
2. **Core Content** (4-8 slides) — The main information, building progressively
3. **Closing** (1-2 slides) — Summary or takeaway

Use a mix of:
- Bullet points for lists
- Tables for comparisons
- Callouts for emphasis and visual variety
- Images if the user provides them

### 4. Offer to Expand

After creating the slideshow, offer to:
- Add more slides on specific subtopics
- Add callouts or visual variety
- Adjust the tone or content level
- Create a companion guide

## Example Slideshow

```markdown
---
title: "Amazing Kitten Facts"
tags:
  - kittens
  - fun-facts
---

# Amazing Kitten Facts

---

## Baby Kittens

- Kittens are born with their eyes closed
- They open their eyes at about 7-10 days old
- All kittens are born with blue eyes

> [!TIP] Did You Know?
> A group of kittens is called a "kindle"!

---

## Kitten Superpowers

- Kittens can rotate their ears 180 degrees
- They have 230 bones (humans have 206)
- A kitten's purr vibrates at 25-150 Hz

---

## . Kitten Comparison

| Kittens | Puppies |
|---|---|
| Independent | Social |
| Purr when happy | Wag tails when happy |
| Land on their feet | Land on their enthusiasm |

---

## What We Learned

> [!SUCCESS] Nice Work!
> You now know more about kittens than most people!
```

## Checklist

- [ ] Frontmatter with title and tags
- [ ] Title slide is header-only (gets a kitten automatically)
- [ ] 8-15 slides with clear progression
- [ ] 4-6 slides have kittens (via header-only or kitten-bearing callouts)
- [ ] Variety across callout types
- [ ] File saved in the right location with a descriptive name
