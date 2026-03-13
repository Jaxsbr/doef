# Doef — Agent Guide

Doef is a browser-based drum notation tool for creating short percussion practice exercises. React + TypeScript + Vite. No backend.

## Non-negotiable invariants

- **No backend** — all persistence is client-side (localStorage, file export). Zero server dependencies.
- **SVG rendering** — notation grid is rendered as SVG, not canvas or HTML tables. SVG is scalable and print-friendly.
- **Web Audio API only** — no external audio libraries. Sounds are synthesised or decoded from bundled samples via the Web Audio API.
- **Print-first layout** — every visual component must look correct when printed (CSS `@media print`). No colours that vanish on paper.
- **Conventional commits** — `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`.

## Workflow

1. Check `docs/product/PRD.md` for current scope and feature definitions.
2. Check existing issues or TODOs before starting work.
3. Branch: `feat/description` or `fix/description`.
4. Keep changes small and reviewable — one feature or fix per PR.
5. Write or update tests for any logic change.
6. Run `npm run lint && npm run test` before committing.

## Where changes belong

```
src/
├── components/     # React components (grid, controls, dialogs)
├── hooks/          # Custom React hooks (audio, storage, notation state)
├── model/          # Pure domain types and logic (no React imports)
│   ├── types.ts    # NotationSheet, Bar, Beat, Voice, TimeSignature
│   └── engine.ts   # Timing calculations, grid generation
├── audio/          # Web Audio API playback engine
├── storage/        # localStorage adapters, JSON serialisation
├── utils/          # Shared helpers
└── App.tsx         # Root component
```

### Layer rules

- `model/` has **zero** imports from React or any UI library. Pure TypeScript.
- `hooks/` may import from `model/`, `audio/`, `storage/`. Never the reverse.
- `components/` import from `hooks/` and `model/types`. Never from `audio/` or `storage/` directly.
- `audio/` depends only on `model/`.
- `storage/` depends only on `model/`.

## Key domain concepts

| Concept | Definition |
|---------|-----------|
| **Sheet** | A named, saveable document. Contains metadata + ordered list of Bars. |
| **Bar** | One measure. Has a time signature and a grid of beats × voices. |
| **Voice** | A drum piece (kick, snare, hi-hat, etc.). Each voice occupies one row in the grid. |
| **Cell** | Intersection of one voice and one subdivision. Can be on (hit) or off (rest). |
| **Subdivision** | Smallest time unit in the grid. MVP: 16th notes. |

## Agent operating rules

- Read `docs/product/PRD.md` and `docs/decisions/` before making architectural choices.
- Prefer explicit files over implicit conventions.
- Keep changes small and reviewable — one concern per iteration.
- If something is unclear, read docs/ before guessing.
- When adding a new feature, check PRD.md to confirm it's in scope.
- Log any architectural decision in `docs/decisions/` as an ADR.

## Iterative execution protocol

Every iteration follows this adaptive loop. Do exactly one of branch A or branch B per run.

### Step 1 — Read state

Read `docs/plan/PROGRESS.md`. Note `task-number`, `mvp-complete`, and `next-task`.

**Stop immediately** if either:
- `mvp-complete` is `true`
- `task-number` is >= 300

Report: "MVP complete" or "Run limit reached."

### Step 2 — Branch on next-task

#### Branch A — next-task is set (not "none")

1. Read any relevant spec from `docs/spec/` for this task.
2. Execute the task: write/edit code, tests, or config. Keep the change small and focused.
3. **Verify**: if `package.json` exists, run `npm run lint && npm run test`. Capture pass/fail.
4. **If verification passes**:
   - Commit the code change with a conventional commit message.
   - Update `PROGRESS.md`: increment task-number, set next-task to `none`, set last-result to `pass`, append log row.
   - Commit the progress update.
5. **If verification fails**:
   - Do NOT commit broken code.
   - Update `PROGRESS.md`: increment task-number, replace next-task with a specific description of what failed and must be fixed, set last-result to `fail`, append log row with failure notes.
   - Commit only the progress update.

#### Branch B — next-task is "none"

1. Investigate the current state of the codebase:
   - List `src/` to see what exists.
   - Check if `package.json` exists (project scaffolded?).
   - Run `npm run test` if available to see current test status.
   - Review `docs/product/PRD.md` MVP capabilities — identify what's missing or incomplete.
2. Determine the single most valuable next task toward MVP completion.
3. Update `PROGRESS.md`: increment task-number, set next-task to a clear one-sentence description, set last-result to `investigated`, append log row.
4. Commit the progress update.
5. **Do not execute the task yet** — that happens next iteration.

### Specs (read before implementing related tasks)

| Spec | Path | When relevant |
|------|------|---------------|
| Data model | `docs/spec/data-model.md` | Any model, storage, or grid work |
| SVG grid | `docs/spec/svg-grid.md` | Grid rendering or interaction |
| Audio engine | `docs/spec/audio-engine.md` | Playback or audio work |
| Storage schema | `docs/spec/storage-schema.md` | localStorage save/load work |
