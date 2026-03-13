# Doef — Phase Archive

> Completed phases are appended here in order. Each phase is a separate `## <phase>` section.

---

## mvp

**Goal:** Ship the smallest thing that replaces pen-and-paper for a drummer's practice sheet (all 9 PRD MVP capabilities).

| # | Task | Result | Notes |
|---|------|--------|-------|
| 1 | Investigate codebase state | investigated | src/ empty, no package.json — project not scaffolded |
| 2 | Scaffold Vite + React + TypeScript project | pass | build + lint + test all pass |
| 3 | Investigate state | investigated | model/ empty — need domain types before any other work |
| 4 | Create domain types and voice registry | pass | types.ts, voices.ts, 10 unit tests all green |
| 5 | Investigate state | investigated | types done — need factory functions before grid rendering |
| 6 | Create factory functions | pass | factory.ts + 14 unit tests, 24 total green |
| 7 | Investigate state | investigated | model layer complete — queue SVG grid component |
| 8 | Create DrumGrid SVG component | pass | DrumGrid.tsx + 9 tests, 33 total green |
| 9 | Investigate state | investigated | grid done — need useSheet hook for cell toggle interaction |
| 10 | Create useSheet hook | pass | useSheet.ts + 6 tests, 39 total green |
| 11 | Investigate state | investigated | interaction done — queue PlaybackEngine audio class |
| 12 | Create PlaybackEngine | pass | PlaybackEngine.ts + 9 tests, 48 total green |
| 13 | Investigate state | investigated | audio done — queue localStorage storage layer |
| 14 | Create sheet storage | pass | sheetStorage.ts + 11 tests, 59 total green |
| 15 | Investigate state | investigated | storage done — queue usePlayback hook to bridge engine into React |
| 16 | Create usePlayback hook | pass | usePlayback.ts + 5 tests, 64 total green |
| 17 | Investigate state | investigated | all layers done — queue App.tsx wiring |
| 18 | Wire up App.tsx | pass | App renders DrumGrid + play/stop + 5 tests, 69 total green |
| 19 | Investigate state | investigated | App wired — queue print CSS (last spec item) |
| 20 | Add print CSS | pass | @media print hides controls, forces black hits on white, 69 tests green |
| 21 | Investigate state | investigated | print done — queue auto-save/load (success criteria #3) |
| 22 | Add useAutoSave + App load-on-mount | pass | useAutoSave.ts + 4 tests, App loads latest sheet on refresh, 73 total green |
| 23 | Investigate state | investigated | save/load done — queue BPM control UI (capability #6) |
| 24 | Add BPM control | pass | setBpm in useSheet + input in App, 2 new tests, 76 total green |
| 25 | Investigate state | investigated | BPM done — queue time signature selector (capability #2) |
| 26 | Add time signature control | pass | setTimeSignature in useSheet + select in App, 3 new tests, 79 total green |
| 27 | Investigate state | investigated | time sig done — queue bar count control (capability #3) |
| 28 | Add bar count control | pass | setBarCount in useSheet (1–16 clamped) + input in App, 5 new tests, 84 total green |
| 29 | Investigate state | investigated | bar count done — queue sheet name editing (capability #7 name part) |
| 30 | Add setName to useSheet + sheet-name input in App | pass | setName in useSheet + text input in App header, 3 new tests, 87 total green |
| 31 | Investigate state | investigated | name editing done — only missing MVP capability is #8 Open from list |
| 32 | Add open-from-list UI in App | pass | Open button + sheet list panel, click to load sheet, 4 new tests, 91 total green |
| 33 | Investigate state | investigated | all 9 MVP capabilities complete, 91 tests green — MVP done |

---

## staff-notation

**Goal:** Replace the SVG grid renderer with a 5-line percussion staff (standard notation) renderer.

| # | Time | Task | Result | Notes |
|---|------|------|--------|-------|
| 1 | — | Investigate state | investigated | voices lack staff position data — queue Voice model extension |
| 2 | — | Extend Voice type with staffLine + noteheadType, add unit tests | pass | 97 tests pass |
| 3 | — | Investigate — queue StaffNotation component task | investigated | DrumGrid exists; next: create StaffNotation SVG component |
| 4 | — | Create StaffNotation SVG component | pass | 97 tests pass; component renders 5-line staff with noteheads |
| 5 | — | Investigate — queue App.tsx wiring task | investigated | StaffNotation built; next: wire it into App replacing DrumGrid |
| 6 | — | Wire StaffNotation into App.tsx replacing DrumGrid | pass | 97 tests pass |
| 7 | — | Investigate — queue StaffNotation tests | investigated | no dedicated StaffNotation tests yet |
| 8 | — | Create StaffNotation.test.tsx (14 tests) | pass | 111 tests pass |
| 9 | — | Investigate — queue DrumGrid removal | investigated | DrumGrid unused; queue deletion to complete replacement |
| 10 | — | Delete DrumGrid.tsx and DrumGrid.test.tsx | pass | 102 tests pass across 9 files |
| 11 | — | Investigate — queue print CSS update | investigated | print CSS uses old DrumGrid class names; needs update for StaffNotation |
| 12 | — | Update print CSS for StaffNotation class names | pass | 102 tests pass |
| 13 | — | Investigate — phase complete | investigated | all criteria met: DrumGrid replaced, StaffNotation tested, print CSS updated |

---

## count-in

**Goal:** Render counting syllables (1 e and a, 2 e and a, …) above each bar in the staff notation. Labels must appear above the top staff line aligned to each subdivision column, support all time signatures and 16th-note subdivisions, and print with the sheet.

| # | Time | Task | Result | Notes |
|---|------|------|--------|-------|
| 1 | 2026-03-11T02:28:32Z | Investigate — queue countIn model utility | investigated | no model utility yet; will create countInLabels() in src/model/ |
| 2 | 2026-03-11T02:31:01Z | Create src/model/countIn.ts + 12 unit tests | pass | 114 tests pass |
| 3 | 2026-03-11T02:32:12Z | Investigate — queue StaffNotation count-in rendering | investigated | utility done; next: render labels above staff in StaffNotation.tsx |
| 4 | 2026-03-11T02:35:05Z | Render count-in labels in StaffNotation.tsx | pass | 114 tests pass; COUNT_IN_H=14, labels rendered above staff |
| 5 | 2026-03-11T02:36:21Z | Investigate — queue StaffNotation count-in tests | investigated | rendering done; need tests verifying label content and count |
| 6 | 2026-03-11T02:40:31Z | Add count-in label tests to StaffNotation.test.tsx (4 tests) | pass | 118 tests pass |
| 7 | 2026-03-11T02:42:17Z | Investigate — phase complete | investigated | all criteria met: labels render, all time sigs supported, tests pass |

---

## near-term enhancements

**Goal:** Implement three near-term enhancements from the PRD (count-in labels and full-height playhead are already done):

1. **Export / Import JSON** — Export the current sheet as a `.doef` JSON file download; import a `.doef` file to load a sheet. Wired into App.tsx with Export and Import buttons.
2. **Sticking notation** — Render R/L sticking labels above/below noteheads for voices that have sticking set. Toggle sticking per cell via a separate interaction mode or right-click context.
3. **Metronome overlay** — Audible click track during playback: a distinct tick sound on each quarter-note beat, independently togglable.

| # | Time | Task | Result | Notes |
|---|------|------|--------|-------|
| 1 | 2026-03-11T05:19:36Z | Investigate — queue Export JSON task | investigated | scoped phase: Export JSON, Sticking notation, Metronome overlay; first: exportSheet() + Export button |
| 2 | 2026-03-11T05:25:56Z | Add exportSheet() + Export button for .doef JSON download | pass | sheetStorage.exportSheet() + App.tsx Export button; 118 tests pass |
| 3 | 2026-03-11T05:30:23Z | Investigate — queue importSheet + Import button | investigated | export done; import side missing: importSheet() parser + file input in App |
| 4 | 2026-03-11T05:34:39Z | Add importSheet() + Import button for .doef file loading | pass | hidden file input + FileReader in App.tsx; 118 tests pass |
| 5 | 2026-03-11T05:36:24Z | Investigate — queue sticking notation model task | investigated | Cell=boolean; add voiceSticking parallel structure to Bar + toggleSticking to useSheet |
| 6 | 2026-03-11T05:39:02Z | Add voiceSticking to Bar model + toggleSticking to useSheet | pass | optional field, null-cycles R→L→null; backward compat with old sheets; 118 tests pass |
| 7 | 2026-03-11T05:40:15Z | Investigate — queue sticking label rendering | investigated | model done; next: render R/L text above noteheads in StaffNotation + onStickingClick prop |
| 8 | 2026-03-11T05:43:08Z | Render R/L sticking labels in StaffNotation + onStickingClick prop | pass | labels at cy-NH_RY-3, right-click wires onContextMenu; 118 tests pass |
| 9 | 2026-03-11T05:44:09Z | Investigate — queue App.tsx sticking wiring | investigated | onStickingClick prop exists but not wired in App; toggleSticking from useSheet needs passing |
| 10 | 2026-03-11T05:46:25Z | Wire toggleSticking into App.tsx as onStickingClick | pass | sticking feature end-to-end; right-click cycles R→L→null; 118 tests pass |
| 11 | 2026-03-11T06:08:10Z | Investigate — queue metronome overlay task | investigated | PlaybackEngine uses scheduleTick loop; add setMetronome() + beat-boundary click in engine |
| 12 | 2026-03-11T06:10:54Z | Add setMetronome() + beat-boundary click to PlaybackEngine | pass | 1kHz sine 20ms pop on nextCell%beatInterval===0; 118 tests pass |
| 13 | 2026-03-11T06:13:01Z | Investigate — queue metronome toggle wiring | investigated | engine has setMetronome(); need metronomeOn state in usePlayback + button in App.tsx |
| 14 | 2026-03-11T06:13:40Z | Expose metronome toggle in usePlayback + Metro button in App.tsx | pass | metronomeOn state + toggleMetronome; Metro: On/Off button; 118 tests pass |
| 15 | 2026-03-11T06:14:17Z | Investigate — phase complete | investigated | all 3 features done (Export/Import, Sticking, Metronome); 118 tests pass |

---

## full-height-playhead

**Goal:** Extend the active-column playhead highlight to span the full vertical extent of all voices — from the topmost notehead position (crash ledger above staff) to the bottommost (kick ledger below staff) — so no voice is ever outside the highlighted column during playback. Also fix the voice click bug where all clicks in a column route to kick because each voice renders a full-column transparent hit rect and the last-rendered (kick) always wins.

| # | Time | Task | Result | Notes |
|---|------|------|--------|-------|
| 1 | 2026-03-11T04:30:38Z | Investigate — queue voice click bug fix | investigated | kick always wins clicks due to full-column transparent rects; fix: per-voice hit zones |
| 2 | 2026-03-11T04:47:16Z | Fix voice click bug: per-voice hit zones in StaffNotation | pass | replaced full-column rect with HALF_STEP*2 height rect centred on cy |
| 3 | 2026-03-11T04:47:47Z | Investigate — queue full-height playhead extend | investigated | active highlight only covers staff lines; needs to reach crash(+6) and kick(-6) ledger positions |
| 4 | 2026-03-11T04:50:58Z | Extend active-column highlight to yOf(6)→yOf(-6) | pass | highlight now spans full voice extent from crash ledger to kick ledger |
| 5 | 2026-03-11T04:55:37Z | Investigate — phase complete | investigated | both goals done: full-height playhead ✓, voice click fix ✓; all 118 tests pass |

---

## medium-term

**Goal:** Implement medium-term features from the PRD, prioritised by user value:

1. **Clear beats** — button to remove all hits from the current sheet, with a `window.confirm()` prompt before clearing.
2. **Undo / redo** — full edit history so drummers can step back through changes.
3. **Keyboard shortcuts** — power-user navigation: space to play/stop, arrow keys to move through bars, delete to clear a cell.

| # | Time | Task | Result | Notes |
|---|------|------|--------|-------|
| 1 | 2026-03-11T06:20:00Z | Investigate — queue Clear beats task | investigated | scoped phase: Clear beats, Undo/redo, Keyboard shortcuts; first: clearSheet() + confirm button |
| 2 | 2026-03-11T06:22:51Z | Add clearSheet() to useSheet + Clear button with confirm in App | pass | clears all voiceCells to false + voiceSticking; confirm guard; 118 tests pass |
| 3 | 2026-03-11T06:24:13Z | Investigate — queue undo/redo task | investigated | clear done; next: past/future stacks in useSheet for full edit history |
| 4 | 2026-03-11T06:27:54Z | Add undo/redo to useSheet via history reducer | pass | useReducer with past/future stacks; canUndo/canRedo/undo/redo exposed; 118 tests pass |
| 5 | 2026-03-11T06:28:38Z | Investigate — queue undo/redo App.tsx wiring | investigated | hook exposes canUndo/redo/undo/redo but App.tsx not wired; need Undo + Redo buttons |
| 6 | 2026-03-11T06:30:30Z | Wire Undo/Redo buttons into App.tsx | pass | disabled when canUndo/canRedo false; 118 tests pass |
| 7 | 2026-03-11T06:32:13Z | Investigate — queue keyboard shortcuts task | investigated | undo/redo done; last goal item: Space=play/stop, Ctrl+Z=undo, Ctrl+Shift+Z=redo |
| 8 | 2026-03-11T06:35:06Z | Add keyboard shortcuts: Space, Ctrl+Z, Ctrl+Shift+Z/Y | pass | useEffect keydown listener; skips input/select targets; 118 tests pass |
| 9 | 2026-03-11T06:36:15Z | Investigate — phase complete | investigated | all 3 goals done (Clear, Undo/redo, Keyboard shortcuts); 118 tests pass |

---

## ux-improvements

**Goal:** Make Doef frictionless for solo practice use. The app is functionally complete but visually cramped and hard to discover. Known pain points from user testing:

1. **Layout and scale** — controls bar has 12+ unstyled elements in a flat line; buttons are too small to comfortably click.
2. **Discoverability** — sticking (right-click), metronome toggle, and import/export have no guidance; users can't find them.
3. **Onboarding** — a blank sheet gives no indication of what to do first.
4. **Interaction feedback** — no visual confirmation that a hit was placed, sticking changed, or file imported.

Each task: investigate one pain point, implement a focused fix, verify. Phase is complete when all four pain points have at least one improvement shipped and all tests pass.

| # | Time | Task | Result | Notes |
|---|------|------|--------|-------|
| 1 | 2026-03-11T06:54:20Z | Investigate — queue CSS layout task | investigated | zero screen CSS; controls bar unstyled flat line; first: flex layout + bigger buttons + grouped controls |
| 2 | 2026-03-11T06:57:24Z | Add screen CSS layout — flex header, grouped controls, 36px buttons | pass | 4 control-groups, blue play button, hover/disabled states, focus rings; 118 tests pass |
| 3 | 2026-03-11T06:58:26Z | Investigate — queue discoverability hint bar | investigated | sticking/shortcuts undiscoverable; add persistent hint bar below controls |
| 4 | 2026-03-11T07:00:44Z | Add hint bar with click/right-click/Space/Ctrl+Z hints | pass | slim bar between header and main; kbd tags; hidden on print; 118 tests pass |
| 5 | 2026-03-11T07:02:59Z | Investigate — queue empty-state onboarding prompt | investigated | pain points #3 and #4 remain; onboarding higher impact for new users; queue SVG prompt when no hits placed |
| 6 | 2026-03-11T07:03:32Z | Add empty-state onboarding hint in StaffNotation | pass | hasAnyHit check; text rendered below staff when all cells empty; 118 tests pass |
| 7 | 2026-03-11T07:04:09Z | Investigate — queue import feedback flash | investigated | hit/sticking feedback implicit in SVG; import is silent; queue brief "Sheet imported" flash notification |
| 8 | 2026-03-11T07:04:48Z | Add "Sheet imported" flash notification in App.tsx | pass | fixed-position toast; 2s timeout; aria-live polite; flash-in animation; 118 tests pass |
| 9 | 2026-03-11T07:05:17Z | Investigate — phase complete | investigated | all 4 pain points addressed: layout ✓ discoverability ✓ onboarding ✓ interaction feedback ✓; 118 tests pass |
