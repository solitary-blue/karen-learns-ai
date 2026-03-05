# Skill: Lesson for Karen

## Purpose

Create lessons for Karen's AI literacy curriculum. Lessons are markdown files rendered as slideshows by the kittens app (`.apps/kittens`). Each lesson is presented by Karen's guide (Michael) and should follow Montessori-informed pedagogy.

The curriculum has two threads: **Agentic AI** (understanding and using AI agents) and **The Second Brain** (Obsidian + Slack + MCP as a personal knowledge system). See `curriculum/roadmap.md` for the full plan, section structure, and how these threads interleave.

## When to Use

- Creating a new lesson for the curriculum
- Revising or expanding an existing lesson
- The guide asks to "write a lesson about X" or "create slides for X"

## Lesson Format

### File Structure

Lessons live in `curriculum/` with naming convention: `NN_topic-slug_AUDIENCE.md`

- `NN` — sequential lesson number (zero-padded)
- `topic-slug` — kebab-case topic description
- `AUDIENCE` — either `KAREN` (the slideshow) or `GUIDE` (presenter notes)

Always create **both files** for each lesson:
- The `KAREN` file is the actual slideshow Karen sees
- The `GUIDE` file has timing, talking points, anticipated difficulties, and discussion prompts

### Frontmatter

Every `KAREN` lesson starts with YAML frontmatter:

```yaml
---
title: "Lesson Title"
aliases:
  - Alternative Name
tags:
  - ai-literacy
  - section-slug
audience: Karen
duration_minutes: 15
section: "Section Name"
lesson_number: 5
---
```

### Slides

Slides are separated by `---` on its own line (with blank lines above and below):

```markdown
---
title: Lesson Title
---

# Lesson Title

Introduction text — set the scene, connect to previous learning.

---

## Slide Heading

Content for this slide.

---

## . Hidden Heading

A `.` prefix on a heading hides the title on that slide (useful for visual/diagram slides where the heading is just for navigation in the slide list).
```

### Slide Count

Each lesson should have **10–20 slides**, following this general arc:

1. **Opening** (1–2 slides) — Welcome, connect to previous lesson, state what we'll learn
2. **Core Content** (5–12 slides) — The new concepts, building progressively
3. **Practice / Activity** (2–3 slides) — Hands-on exercise or guided exploration
4. **Questions** (1–2 slides) — Check for understanding
5. **Closing** (1 slide) — Summary, preview of next lesson

### Callouts

Use Obsidian-style callouts for emphasis. Available types:

| Type | Use For |
|------|---------|
| `[!NOTE]` | Key information, definitions |
| `[!TIP]` | Practical advice, shortcuts |
| `[!WARNING]` | Common mistakes, pitfalls |
| `[!SUCCESS]` | Things Karen has already mastered |
| `[!QUESTION]` | Check-for-understanding prompts |
| `[!EXAMPLE]` | Worked examples, demonstrations |
| `[!INFO]` | Background context |
| `[!QUOTE]` | Quotes from sources |

Syntax:
```markdown
> [!TIP] Practical Tip
> Always save important ideas to a file before ending a session!
```

### Questions Section

End each lesson with a questions slide using the `[!QUESTION]` callout:

```markdown
---

## Check Your Understanding

> [!QUESTION] Think About It
> 1. In your own words, what is the difference between X and Y?
> 2. Can you think of a time in your classroom where Z would be useful?
> 3. What would happen if you tried A instead of B?
```

Questions should:
- Mix recall ("What is...") with application ("How would you use...")
- Connect to Karen's classroom experience when possible
- Be answerable from the lesson content (no trick questions)
- Include 2–4 questions per lesson

### Diagrams

When a concept benefits from visual explanation, create an excalidraw diagram using the `excalidraw-diagram` skill. Good candidates for diagrams:

- **Processes and flows** — The agent loop, how context works, prompt → response
- **Comparisons** — Chatbot vs. agent, short-term vs. long-term memory
- **Hierarchies** — File organization, instruction inheritance
- **Timelines** — How a session unfolds, multi-step workflows

Reference the diagram in the slide:

```markdown
---

## . How the Agent Loop Works

![Agent Loop Diagram](diagrams/agent-loop.excalidraw.png)
```

Use hidden headings (`.` prefix) for diagram-dominant slides so the visual speaks for itself.

**Important:** Diagram rendering in kittens is a future feature. For now, create the `.excalidraw` files and reference them — they'll display once support is added.

## Pedagogical Principles

### Montessori-Informed Approach

1. **Whole Before Parts** — Show the big picture first, then zoom into details. Start each lesson with context: "Here's what we're building toward."

2. **Concrete Before Abstract** — Use analogies Karen already understands (classroom management, lesson planning, the scrapbook metaphor for Git). Introduce the technical term only after the concept clicks.

3. **Follow the Learner** — Each lesson should have one clear concept. Don't overload. If a topic needs more than 20 slides, split it into multiple lessons.

4. **Independence** — Include "Action" steps where Karen does something herself (types a prompt, opens a file, tries an experiment). Learning happens through doing, not just reading.

5. **Prepared Environment** — Connect each lesson to the tools Karen actually uses (Claude Code, SourceTree, her projects folder). Abstract concepts should land in her real workspace.

### Lesson Sequence Awareness

Every lesson exists within a sequence. When crafting a lesson:

- **Review** — Start with a brief connection to the previous lesson (retrieval practice)
- **Bridge** — Show how today's topic builds on what Karen already knows
- **Preview** — End with a teaser for the next lesson
- **Spiral** — Revisit earlier concepts in new contexts (e.g., "Remember how we talked about the Working Notepad? That's actually called a context window.")

### Second Brain Integration

For lessons in Sections 6–8 (after Karen has set up her Second Brain), weave in how the vault/Slack capture/MCP connect to the lesson topic:

- **Research lessons** — show how findings get saved to the vault
- **Writing lessons** — demonstrate pulling context from vault notes
- **Workflow lessons** — show agents accessing Karen's knowledge via MCP
- **Classroom lessons** — reference stored lesson plans and teaching notes

Don't force it — only include Second Brain touchpoints where they naturally fit the lesson's core concept.

### Vocabulary Strategy

Karen's curriculum uses a system of **friendly names** that map to technical terms:

| Friendly Name | Technical Term | Introduced In |
|---------------|---------------|---------------|
| Working Notepad | Context Window | Exercise 3 |
| Digital Scrapbook | Git Repository | Exercise 2 |
| Time Machine Code | Commit SHA | Exercise 2 |
| Fresh Mind | New Session | Exercise 3 |
| Permanent Ledger | Committed Files | Exercise 3 |

When introducing a new concept:
1. Use the friendly name first with a clear analogy
2. Use the friendly name consistently for 2–3 lessons
3. Gradually introduce the technical term alongside the friendly name
4. Eventually use both interchangeably

Add new vocabulary pairs to this table (in the roadmap) as lessons are created.

## Guide Notes Format

The `GUIDE` file should follow this structure:

```markdown
# Lesson NN: Topic (GUIDE PLAN)

**Goal:** One sentence stating what Karen should understand/be able to do after this lesson.
**Duration:** X–Y minutes.
**Prerequisites:** List lessons Karen should have completed.
**Materials:** Any files, apps, or setup needed.

## Key Concepts
- Concept 1: Brief explanation + the analogy to use
- Concept 2: Brief explanation + the analogy to use

## Lesson Flow

### 1. Opening — Review & Connect (X mins)
- What to say/ask to connect to previous lesson
- Expected responses from Karen

### 2. Core Content (X mins)
- Talking points for each slide
- When to pause for questions
- Anticipated difficulties and how to address them

### 3. Activity (X mins)
- Step-by-step guide for the hands-on exercise
- What success looks like
- Common mistakes and how to redirect

### 4. Questions & Discussion (X mins)
- The questions from the slides
- Expected answers / acceptable answer range
- Follow-up prompts if Karen is stuck

### 5. Closing (X mins)
- Key takeaway to reinforce
- Preview of next lesson

## Hinge Questions
Questions that reveal whether Karen has grasped the core concept:
- If she answers X → she's got it, move on
- If she answers Y → revisit the analogy, try Z approach

## Anticipated Difficulties
- Difficulty 1: How to address it
- Difficulty 2: How to address it
```

## Checklist Before Finishing

- [ ] KAREN file has proper frontmatter (title, tags, audience, duration, section, lesson_number)
- [ ] 10–20 slides with clear progression
- [ ] Opens with connection to previous learning
- [ ] One core concept per lesson (not overloaded)
- [ ] Concrete analogies before technical terms
- [ ] At least one "Action" step where Karen does something
- [ ] Questions section at the end with 2–4 questions
- [ ] Closes with summary and preview of next lesson
- [ ] Callouts used appropriately (not overused — max 3–4 per lesson)
- [ ] GUIDE file created with timing, talking points, and anticipated difficulties
- [ ] Diagrams created (via excalidraw-diagram skill) where visual explanation helps
- [ ] New vocabulary pairs documented
