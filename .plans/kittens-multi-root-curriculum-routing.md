# Kittens Multi-Root Curriculum Routing

**Status:** Draft

## Goal

Keep Kittens as a single running app, but allow one instance to present lessons from multiple curriculum roots. The selected root should come from the URL path, remain configurable, preserve the existing `/` behavior, and be switchable from inside the left sidebar without forcing Karen to hand-edit the URL mid-lesson.

## Recommendation

Choose **path-keyed curriculum roots** over launching multiple Kittens instances.

Why:
- Karen can keep one browser tab and one running dev server during a lesson.
- The active curriculum becomes shareable and bookmarkable in the URL.
- The current `?lesson=` and `?slide=` query-param model can stay intact.
- A sidebar root switcher can change roots with one click while still deep-linking correctly.

Do **not** optimize for multiple server instances first. That is still possible later, but it should not be the primary workflow.

## Current State

All paths below are relative to `.apps/kittens/` unless noted otherwise.

- `src/app/page.tsx` is a client page that reads `?lesson=` and fetches `/api/lessons/${slug}`.
- `src/components/SlideShow.tsx` fetches `/api/lessons?folder=...` for the left sidebar listing and pushes `/?lesson=${slug}` when navigating.
- `src/app/api/lessons/[...slug]/route.ts` reads markdown from `process.env.CURRICULUM_DIR ?? path.resolve(getProjectRoot(), '../../curriculum')`.
- `src/app/api/lessons/route.ts` lists folders and lessons from the same single curriculum directory.
- `src/lib/markdown.ts` rewrites relative lesson images to `/api/curriculum-images/...`.
- `src/app/api/curriculum-images/[...path]/route.ts` also assumes one curriculum root.
- Existing tests already cover the lesson listing route, lesson fetch route, and markdown image rewriting.

This means curriculum root selection is currently global, process-level, and awkward to change during a live lesson.

## Desired Behavior

### URL contract

- `http://localhost:3000/` stays mapped to the default root and continues to behave like today.
- `http://localhost:3000/karen-learns-ai` can map to the current repo's curriculum.
- `http://localhost:3000/workspace` can map to `../workspace/curriculum`.
- The mapping must be configurable so `workspace` can instead live at `/work`.
- Only the **leading path segment** selects the curriculum root for now.
- Lesson and slide selection stay in query params for this iteration:
  - `/<root>?lesson=01-topic/02_lesson_KAREN&slide=3`

### UX contract

- The left sidebar gets a new root switcher near the bottom.
- Switching roots should preserve the current UI shell and navigate to the new root URL.
- If the current `lesson` slug does not exist in the new root, fall back to the configured default lesson for that root or to the first available lesson.
- Root labels shown in the UI should be human-readable and come from config, not inferred from folder names.

## Recommended Config Model

Extend `app-config.yml` with a curriculum-roots section rather than inventing a separate config file.

Recommended shape:

```yaml
kitten-size: 400px
callout-kitten-size: 250px
kitten-min-other-lines: 3

curriculum-root-default: current
curriculum-roots:
  - id: current
    label: Karen Learns AI
    path-segments: ['', 'karen-learns-ai']
    enclosing-dir: karen-learns-ai
  - id: workspace
    label: Workspace
    path-segments: ['workspace', 'work']
    enclosing-dir: workspace
```

Resolution rule:
- Interpret `enclosing-dir` relative to the **parent of the current repo root**, then append `/curriculum`.
- Example with this repository at `/Users/.../lastobelus-2025/karen-learns-ai`:
  - `enclosing-dir: karen-learns-ai` -> `/Users/.../lastobelus-2025/karen-learns-ai/curriculum`
  - `enclosing-dir: workspace` -> `/Users/.../lastobelus-2025/workspace/curriculum`

Important implementation rule:
- The app should resolve the path segment to a **canonical root id** once, then use that root id internally for API calls and UI state.

## Architecture Plan

### 1. Introduce a root-resolution library

Create a focused server utility, for example `src/lib/curriculum-roots.ts`, to own:
- parsing curriculum root config from `app-config.yml`
- resolving the repo root and the parent directory that contains sibling content roots
- mapping URL path segments to canonical root ids
- returning the absolute curriculum directory for a root id
- returning root metadata needed by the client UI

Keep all path validation and normalization in this one place so API routes and page routing cannot drift.

### 2. Make the page route root-aware

Replace the current single `/` page entry with an optional catch-all page route:
- move from `src/app/page.tsx`
- to `src/app/[[...rootKey]]/page.tsx`

Recommended split:
- `src/app/[[...rootKey]]/page.tsx` becomes a thin server wrapper that resolves the root from the path.
- move the current client logic into a new client component such as `src/components/LessonLoader.tsx`.

Reason:
- the server page can validate the path segment once and pass a clean `rootContext` prop to the client.
- the client can continue to own `useSearchParams`, theme lookups, loading, and error handling.

### 3. Pass root id explicitly through API calls

Do not rely on global process state after this change.

Recommended API contract:
- `/api/lessons?folder=...&root=<rootId>`
- `/api/lessons/${slug}?theme=...&root=<rootId>`
- `/api/curriculum-images/...?...&root=<rootId>`

Why query params instead of path prefixes:
- lower churn in existing route files
- easier migration from the current client fetches
- no need to restructure lesson slug handling

### 4. Make markdown image rewriting root-aware

Update `parseMarkdownToSlides()` to accept `rootId` and append `?root=<rootId>` when rewriting relative lesson images.

That keeps images tied to the same curriculum root as the lesson that referenced them.

### 5. Add the sidebar root switcher

`SlideShow.tsx` already owns the sidebar, lesson navigation, and router pushes, so it is the correct place for the first UI iteration.

Add a root switcher section at the bottom of the left sidebar that:
- shows the active root label
- lists the configured roots
- pushes to the correct path for the selected root
- preserves `slide=0` only when changing lessons; preserve current slide only if the lesson slug survives the switch

Prefer a simple, sturdy UI over a fancy one for this first pass.

## TDD Plan

Work strictly in red/green/refactor slices.

### Phase 1: Root resolution library

#### Red

Create `src/lib/curriculum-roots.test.ts` with failing tests for:
- reading the new config shape from `app-config.yml`
- resolving the default root for `/`
- resolving a named path segment like `workspace`
- resolving an alias path segment like `work`
- rejecting unknown root path segments
- computing absolute curriculum directories from the parent of the current repo root
- rejecting curriculum directories that escape the expected parent directory

Mock `fs` and `getProjectRoot()` in the same style already used in `kitten-config.test.ts` and the API route tests.

#### Green

Implement `src/lib/curriculum-roots.ts` and extend `src/lib/kitten-config.ts` only as needed so root config is loaded through the existing app config pathway.

#### Refactor

Keep one canonical type for root metadata, for example:

```ts
type CurriculumRoot = {
  id: string;
  label: string;
  pathSegments: string[];
  enclosingDir: string;
};
```

### Phase 2: Root-aware lesson APIs

#### Red

Extend `src/app/api/lessons/route.test.ts` and `src/app/api/lessons/[...slug]/route.test.ts` with failing tests for:
- `root=<id>` selecting a non-default curriculum directory
- missing or invalid `root` falling back to the configured default only when appropriate
- unknown `root` returning a clear `404` or `400` error instead of silently using the default
- lesson listing preserving current folder behavior within the selected root
- lesson fetch passing the selected root id into markdown parsing

Add a new test file for `src/app/api/curriculum-images/[...path]/route.ts` covering:
- valid image fetch within a selected root
- invalid root id
- path traversal attempt inside image path
- image not found in the selected root

#### Green

Update all three API routes to use the new root-resolution library.

### Phase 3: Root-aware markdown image rewriting

#### Red

Extend `src/lib/markdown.test.ts` with failing tests for:
- rewriting a relative image URL with the selected `root` query param
- preserving external and absolute URLs unchanged
- handling lesson slugs in nested folders while still attaching the root query param

#### Green

Update `parseMarkdownToSlides(markdown, themeName, lessonSlug, rootId)` and the internal rewrite helper accordingly.

#### Refactor

If URL construction becomes noisy, extract a tiny helper so image URLs and lesson fetch URLs share the same encoding rules.

### Phase 4: Path-based page routing

#### Red

Add focused tests around the new page-level root parsing behavior. If full page tests feel too heavy, extract a pure helper and test that instead.

The failing cases should prove:
- `/` resolves to the configured default root
- `/workspace` resolves to the workspace root
- `/work` resolves through aliasing to the workspace root
- `/<unknown>` renders a not-found state or a clear error state instead of accidentally loading the default root

#### Green

Implement `src/app/[[...rootKey]]/page.tsx`, move the existing client behavior into a dedicated client component, and pass a resolved root context into it.

Delete `src/app/page.tsx` once the catch-all route fully replaces it.

### Phase 5: Sidebar switcher UX

#### Red

Create a new client test for `SlideShow.tsx` or extract a helper and test that if the component test becomes too brittle.

The failing cases should cover:
- lesson navigation preserving the current root path prefix
- listing fetches including `root=<rootId>`
- selecting a different root builds the correct destination URL
- the switcher renders configured root labels, not filesystem names

#### Green

Add the root switcher UI at the bottom of the left sidebar and thread the root props through `LessonLoader` and `SlideShow`.

#### Refactor

Centralize URL creation for:
- lesson navigation
- folder listing fetches
- root switching

That avoids subtle bugs where one part of the UI forgets the active root.

## Expected File Changes

Primary implementation targets:
- `.apps/kittens/app-config.yml`
- `.apps/kittens/src/lib/curriculum-roots.ts` (new)
- `.apps/kittens/src/lib/curriculum-roots.test.ts` (new)
- `.apps/kittens/src/lib/kitten-config.ts`
- `.apps/kittens/src/lib/types.ts`
- `.apps/kittens/src/lib/markdown.ts`
- `.apps/kittens/src/lib/markdown.test.ts`
- `.apps/kittens/src/app/[[...rootKey]]/page.tsx` (new)
- `.apps/kittens/src/app/page.tsx` (remove after replacement)
- `.apps/kittens/src/components/LessonLoader.tsx` (new, recommended)
- `.apps/kittens/src/components/SlideShow.tsx`
- `.apps/kittens/src/app/api/lessons/route.ts`
- `.apps/kittens/src/app/api/lessons/route.test.ts`
- `.apps/kittens/src/app/api/lessons/[...slug]/route.ts`
- `.apps/kittens/src/app/api/lessons/[...slug]/route.test.ts`
- `.apps/kittens/src/app/api/curriculum-images/[...path]/route.ts`
- `.apps/kittens/src/app/api/curriculum-images/[...path]/route.test.ts` (new)
- `.apps/kittens/docs/README.md`
- `docs/kittens/README.md`

## Validation Sequence

Run validation in small slices instead of waiting until the end.

Suggested sequence:
- `npm run test -- src/lib/curriculum-roots.test.ts`
- `npm run test -- src/app/api/lessons/route.test.ts src/app/api/lessons/[...slug]/route.test.ts`
- `npm run test -- src/lib/markdown.test.ts`
- `npm run test -- src/app/api/curriculum-images/[...path]/route.test.ts`
- `npm run test`
- dry-run lint on changed files first, per repo rules
- `npm run typecheck`
- `npm run build`

If linting touched files, do a dry run before the first real lint pass on those files.

## Browser Validation

After the tests pass, validate in the browser with a running Kittens instance:
- `/` still opens the default curriculum.
- `/karen-learns-ai` loads the same curriculum as `/` if configured as an alias.
- `/workspace` or `/work` loads lessons from the workspace curriculum.
- changing roots from the sidebar updates the URL and lesson list correctly.
- relative images render correctly in both roots.
- an invalid root path shows a clear failure mode.

## Risks And Edge Cases

- Unknown root path segments must not silently fall back to the default, or Karen may present the wrong lesson set without noticing.
- The current lesson slug may exist in one root but not another; define a deterministic fallback.
- Relative image rewriting must stay aligned with the selected root or slides will render but images will break.
- The catch-all route must not interfere with Next.js API routes.
- Config parsing should fail closed for invalid roots, but lesson rendering should still fail with a human-readable error.

## Out Of Scope For This Iteration

- running multiple Kittens dev servers as the primary workflow
- per-root themes or per-root font settings
- moving lesson slugs from query params into the pathname
- editing curriculum-root config from inside the UI

## Definition Of Done

- One Kittens instance can serve at least two curriculum roots.
- `/` remains a configurable default root.
- path-segment aliases like `/work` are supported through config.
- the sidebar includes a working root switcher.
- lessons, listings, and relative images all resolve against the selected root.
- tests cover the resolver, API routes, markdown image rewriting, and root-aware navigation.
- docs explain how to add a new curriculum root.
