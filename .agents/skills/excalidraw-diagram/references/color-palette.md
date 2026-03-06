# Color Palette & Brand Style (Dracula Theme)

**This is the single source of truth for all colors and brand-specific styles.** To customize diagrams for your own brand, edit this file — everything else in the skill is universal.

---

## Shape Colors (Semantic)

Colors encode meaning, not decoration. Each semantic purpose has a fill/stroke pair.

| Semantic Purpose | Fill | Stroke |
|------------------|------|--------|
| Primary/Neutral | `#bd93f9` | `#282a36` |
| Secondary | `#44475a` | `#f8f8f2` |
| Tertiary | `#6272a4` | `#f8f8f2` |
| Start/Trigger | `#50fa7b` | `#282a36` |
| End/Success | `#8be9fd` | `#282a36` |
| Warning/Reset | `#ffb86c` | `#282a36` |
| Decision | `#f1fa8c` | `#282a36` |
| AI/LLM | `#ff79c6` | `#282a36` |
| Inactive/Disabled | `#282a36` | `#6272a4` (use dashed stroke) |
| Error | `#ff5555` | `#282a36` |

**Rule**: Always pair a darker stroke with a lighter fill (or vice versa for dark themes) for contrast.

---

## Text Colors (Hierarchy)

Use color on free-floating text to create visual hierarchy without containers.

| Level | Color | Use For |
|-------|-------|---------|
| Title | `#bd93f9` | Section headings, major labels |
| Subtitle | `#ff79c6` | Subheadings, secondary labels |
| Body/Detail | `#f8f8f2` | Descriptions, annotations, metadata |
| On light fills | `#282a36` | Text inside light-colored shapes |
| On dark fills | `#f8f8f2` | Text inside dark-colored shapes |

---

## Evidence Artifact Colors

Used for code snippets, data examples, and other concrete evidence inside technical diagrams.

| Artifact | Background | Text Color |
|----------|-----------|------------|
| Code snippet | `#44475a` | Syntax-colored (language-appropriate) |
| JSON/data example | `#44475a` | `#50fa7b` (green) |

---

## Default Stroke & Line Colors

| Element | Color |
|---------|-------|
| Arrows | Use the stroke color of the source element's semantic purpose |
| Structural lines (dividers, trees, timelines) | Comment/Muted (`#6272a4`) or Foreground (`#f8f8f2`) |
| Marker dots (fill + stroke) | Primary fill (`#bd93f9`) |

---

## Background

| Property | Value |
|----------|-------|
| Canvas background | `#282a36` |
