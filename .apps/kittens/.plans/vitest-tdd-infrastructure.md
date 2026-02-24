# Vitest TDD Infrastructure for Kittens

**Status:** Complete ✅

## Context

The Kittens app has one test file (`frontmatter.test.ts`, 3 tests) and no vitest config. Four other `src/lib/` modules and the lesson API route have zero test coverage. The goal is a solid test foundation that makes TDD comfortable: fast watch mode, good coverage visibility, clean mocking patterns established by example, and enough existing tests to serve as templates for new feature development.

## Phase 1: Infrastructure

All paths relative to `.apps/kittens/`.

### 1.1 Install dependency

```bash
npm install -D @vitest/coverage-v8
```

No other deps needed. No `jsdom`/`happy-dom` — all modules under test are pure Node.js logic.

### 1.2 Create `vitest.config.ts`

- Path alias `@/` matching tsconfig
- Coverage via v8: reporters `text`, `html`, `json-summary`
- Cover `src/lib/**/*.ts` and `src/app/api/**/*.ts`, exclude `types.ts`, `utils.ts`, test files
- `restoreMocks: true` — auto-cleanup after each test
- `setupFiles: ['./src/test/setup.ts']`
- Coverage thresholds: lines 60%, branches 50%, functions 60% (ratchet up later)

### 1.3 Create `src/test/setup.ts`

Single job: `vi.mock('server-only', () => ({}))` — neutralizes the `server-only` import that `callout-config.ts` uses (throws at import time outside Next.js server context). Global setup means no test file needs to think about it.

### 1.4 Create `src/test/fixtures.ts`

Reusable test data:
- `SIMPLE_LESSON` — frontmatter + two slides
- `LESSON_WITH_CALLOUT` — callout blockquote
- `LESSON_HIDDEN_TITLE` — dot-prefix hidden title
- Frontmatter edge cases: date coercion, CRLF, empty block, null value, nested object
- `TEST_CALLOUT_CONFIG` — minimal callout config record (avoids filesystem reads)

### 1.5 Update `package.json` scripts

```json
"test:watch": "vitest",
"test:coverage": "vitest run --coverage"
```

Existing `"test": "vitest run"` unchanged (CI uses it).

### 1.6 Add `coverage/` to `.gitignore`

## Phase 2: Test Coverage for lib/ Modules

### 2.1 Extend `src/lib/frontmatter.test.ts` (+5 tests)

- Date coercion (js-yaml auto-parses `2024-06-15` → Date → `"2024-06-15"` string)
- Windows CRLF line endings
- Empty frontmatter block (`---\n---\n`)
- Null values preserved in metadata
- Nested objects silently dropped

### 2.2 Create `src/lib/callout-config.test.ts` (~5 tests)

**Key pattern:** `vi.resetModules()` + dynamic `import()` per test to defeat the module-level `let cachedConfig` cache.

- Array-format YAML with alias registration
- Config file not found → empty callouts
- YAML parse error → empty callouts (fail-open)
- Caching: `readFileSync` called only once across multiple loads
- Record-format callouts (non-array YAML)

### 2.3 Create `src/lib/remark-callout.test.ts` (~6 tests)

Mock `./callout-config` → `TEST_CALLOUT_CONFIG`. Do NOT mock `lucide` (static data, works fine in Node). Test via unified pipeline (same as production).

- `[!note]` blockquote → callout HTML with icon SVG
- Custom title after type (`[!tip] My Title`)
- Alias resolution (`[!important]` → tip styling)
- Unknown type → falls back to note config
- Regular blockquotes left untouched
- Multi-paragraph callout content

### 2.4 Create `src/lib/markdown.test.ts` (~8 tests)

Mock `./callout-config` (same pattern). Integration-level — runs real unified pipeline.

- Splits on `\n---\n` into separate slides
- Extracts heading text as title
- `"Untitled Slide"` when no heading
- Dot-prefix hidden title: strips dot, sets `hideTitle: true`
- Normal title: `hideTitle: false`
- Renders markdown to HTML (bold, etc.)
- Callout blockquotes processed
- Single slide (no separators), empty string input

## Phase 3: API Route Test Pattern

### 3.1 Create `src/app/api/lessons/[slug]/route.test.ts` (~4 tests)

Mock `fs` for filesystem control. Let parsing pipeline run (integration-style).

- Invalid slug (`../etc/passwd`) → 400
- Nonexistent file → 404
- Valid lesson → 200 with parsed metadata + slides
- Slug with hyphens/underscores/numbers accepted

Establishes the pattern for testing any Next.js API route handler.

## Phase 4: CI Integration

### 4.1 Update `.github/workflows/kittens-ci.yml`

Replace separate test + coverage steps with:
```yaml
- name: Test with coverage
  run: npm run test:coverage
```

Thresholds enforced in `vitest.config.ts` (exits non-zero if below threshold), so CI needs no extra scripting.

## Files Summary

| Action | File |
|--------|------|
| Create | `vitest.config.ts` |
| Create | `src/test/setup.ts` |
| Create | `src/test/fixtures.ts` |
| Modify | `src/lib/frontmatter.test.ts` |
| Create | `src/lib/callout-config.test.ts` |
| Create | `src/lib/remark-callout.test.ts` |
| Create | `src/lib/markdown.test.ts` |
| Create | `src/app/api/lessons/[slug]/route.test.ts` |
| Modify | `package.json` |
| Modify | `.gitignore` |
| Modify | `.github/workflows/kittens-ci.yml` |

**~28 new tests + 3 existing = ~31 total**

## Implementation Order

1. Infrastructure (1.1–1.6) — single commit
2. All test files (2.1–3.1) — second commit
3. CI update (4.1) — third commit

## Verification

After each phase: `npm run test` passes, `npm run test:coverage` shows coverage report, `npm run check` (lint + typecheck + test + build) all green.
