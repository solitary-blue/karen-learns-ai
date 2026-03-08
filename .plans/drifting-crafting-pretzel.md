# Plan: Update Chat Room Lesson (01)

**Status:** Complete ✅

## Context

The first lesson ("The Chat Room") needs several content updates to be more accurate, practical, and forward-looking. Key motivations:
- Mention emerging agentic AI apps (Claude Cowork, Codex) so Karen knows the terminal isn't the end state
- Add visual cues (iTerm icon) to help Karen find apps
- Teach practical skills (@ references, window switching) at the right moment
- Fix inaccurate safety messaging ("you can't break anything" → honest but reassuring tiered guidance)
- Note iTerm's auto-copy feature

## Files to Modify

- `curriculum/01-meeting-your-ai/01_the-chat-room_KAREN.md` — all content changes
- `curriculum/01-meeting-your-ai/01_the-chat-room_GUIDE.md` — sync teaching notes
- `curriculum/01-meeting-your-ai/diagrams/iterm-icon.png` — new file (copy + resize from /Applications/iTerm.app)

## Changes

### 1. New slide: "The Bigger Picture" (after "Why a Text Window?")
- Mention Claude Cowork & Codex as examples of agentic AI moving to regular apps
- Note we'll trial and incorporate new tools as they arrive
- NOTE callout: she'll eventually want her own Apple-chip Mac (e.g. Mac mini)

### 2. iTerm icon in "Let's Start with Claude"
- Copy `/Applications/iTerm.app/Contents/Resources/AppIcon.png` → `diagrams/iterm-icon.png`
- Resize to 128x128 with sips
- Add `![iTerm icon](diagrams/iterm-icon.png)` before the action step

### 3. New slide: "Come Back to the Lesson" (after "Let's Start with Claude")
- Tell Karen to switch back to Safari/kittens
- TIP callout teaching Cmd+Tab for window switching

### 4. New slide: "Finding What Claude Built" (after "Give Claude a Real Task")
- Explain the workspace directory
- Show `open @workspace in Finder` command
- TIP callout explaining @ references and fuzzy matching

### 5. Rewrite safety warning in "Two Agents, Different Styles"
- Replace inaccurate WARNING ("can't break anything") with honest tiered NOTE:
  - Always safe: chatting, questions, brainstorming
  - Needs care: file creation/deletion (agents ask permission)
  - Recovery: git can recover things, ask Michael for help

### 6. Auto-copy in "Handy Things to Know"
- Update copy-text bullet: selecting text auto-copies in iTerm, Cmd+C still works but not needed

### 7. Update GUIDE to sync
- Add teaching notes for each new slide (timing, anticipated questions, redirection tips)
- Update total duration: 20-25 minutes
- Add anticipated difficulties for new content (safety concern anxiety, @ confusion, future-apps rabbit hole)
- Add materials note about iTerm icon

## Decisions
- iTerm icon: resize to 128x128
- Name Claude Cowork and Codex specifically in "The Bigger Picture" slide

## Verification

1. Run kittens app and navigate to the Chat Room lesson
2. Verify all slides render correctly (especially the iTerm icon image)
3. Check that callouts render with correct types
4. Confirm slide count is reasonable (~16 slides)
5. Read through both KAREN and GUIDE for consistency
