# Doef — Product Requirements Document

> **doef** (Afrikaans onomatopoeia for a drum hit) — A drum notation tool for practice exercises.

## Problem

Drummers who drill specific exercises (rudiments, groove patterns, fill combinations) need a fast way to notate short passages — typically 4–10 bars — in varying time signatures. Existing music notation software is heavyweight, slow to learn, and overkill for a 2-bar paradiddle exercise. Pen-and-paper works but can't play back the beat or be easily edited and shared.

## User

Working drummers and students who practice deliberately. They know what time signatures and subdivisions are. They don't need a full DAW or Sibelius — they need a focused, fast scratchpad that can also play back what they wrote.

## Story

> As a drummer I want to create drum notation for exercises I need to drill with heavy practice. These are not large musical pieces — typically 4–10 bars that can vary in time signature.

---

## MVP — Instant Value

Ship the smallest thing that replaces pen-and-paper for a drummer's practice sheet.

### Core capabilities

| # | Capability | Detail |
|---|-----------|--------|
| 1 | **Render notation sheet** | Display a standard drum-kit grid: rows = drum voices (kick, snare, hi-hat, toms), columns = beat subdivisions. Visual, readable, print-friendly. |
| 2 | **Set time signature** | Choose a time signature per sheet (e.g. 4/4, 3/4, 6/8, 7/8, 5/4). Drives the grid layout. |
| 3 | **Specify bar count** | Set how many bars the sheet contains (1–16 for MVP). |
| 4 | **Place & remove beats** | Click/tap a grid cell to toggle a hit on/off. Immediate visual feedback. |
| 5 | **Playback** | Play the notation at a configurable BPM using basic percussive sounds (Web Audio API). Visual playhead shows current position. |
| 6 | **Set BPM** | Adjustable tempo control (30–300 BPM). |
| 7 | **Save & name** | Persist a notation sheet with a user-given name to browser local storage. |
| 8 | **Open from list** | Browse saved sheets, open one, edit it. |
| 9 | **Print** | Browser print (Cmd+P / Ctrl+P) produces a clean, ink-friendly layout via CSS print styles. |

### MVP drum voices

Keep it tight — cover the kit basics:

- Hi-hat (closed)
- Hi-hat (open)
- Snare
- Kick (bass drum)
- High tom
- Mid tom
- Floor tom
- Crash cymbal
- Ride cymbal

### MVP subdivision

Grid resolution: sixteenth notes (16th). Each beat divides into 4 cells. This covers the vast majority of practice exercises.

### Tech direction (MVP)

| Concern | Choice | Rationale |
|---------|--------|-----------|
| Framework | React + TypeScript | Boring, composable, excellent agent training coverage |
| Build | Vite | Fast, zero-config for React+TS |
| Rendering | SVG | Scalable, print-friendly, DOM-manipulable |
| Audio | Web Audio API | No external deps, low latency |
| Persistence | localStorage | Zero backend, instant save/load |
| Styling | CSS Modules or Tailwind | Scoped styles, print media queries |
| Testing | Vitest + React Testing Library | Co-located with Vite |

---

## Blue Sky — Future Iterations

Features to consider after MVP is validated. Ordered roughly by user value.

### Near-term enhancements

- **Count-in labels** — Show counting syllables (1 e and a, 2 e and a, …) above each bar. Per-bar control: user selects which subdivision positions to label (e.g. show "1", "e", "a" but hide "and"). Helps students read notation against spoken counts. Labels print with the sheet.
- **Full-height playhead** — Extend the active-column highlight above the top staff line and below the bottom staff line so voices positioned outside the staff (crash cymbal above, hi-hat pedal below) are visually covered by the playhead. The highlight should span from the topmost notehead position to the bottommost.
- **Accent / ghost notes / dynamics** — visual markers for velocity (loud, soft, accent).
- **Sticking notation** — R/L labels above notes for hand assignment.
- **Flams, drags, rolls** — grace-note ornaments rendered as smaller notes.
- **Loop playback** — loop a selection of bars, not just the full sheet.
- **Metronome overlay** — audible click track during playback.
- **Subdivision toggle** — switch between 8th and 16th grid per sheet.
- **Export JSON file** — download/upload notation as a `.doef` JSON file for sharing.

### Medium-term

- **Multiple sheets per project** — group related exercises.
- **Rudiment library** — pre-built patterns (paradiddles, flam taps, ratamacues) loadable as templates.
- **Custom sound samples** — upload or choose from a sample pack.
- **MIDI export** — export notation as a standard MIDI file.
- **PDF export** — server-side or client-side PDF generation for cleaner prints.
- **Undo / redo** — full edit history.
- **Keyboard shortcuts** — power-user navigation and placement.
- **Clear beats** — button to remove all hits from the current sheet, with a confirmation prompt before clearing.

### UX improvements

Iterative, evidence-driven phase focused on making the app frictionless and pleasant for a solo drummer practicing at their kit. This is not a commercial product — the goal is a fast, intuitive scratchpad that gets out of the way.

#### Methodology

Each improvement cycle follows this loop:

1. **Record** — Playwright drives the app against the Vite dev server and takes screenshots at key interaction points (before and after each action). Screenshots are stored in `docs/ux-audit/`.
2. **Critique** — The build loop investigation step reads the screenshots using Claude's vision capability and produces a written UX critique: what looks unclear, cramped, confusing, or missing.
3. **Queue** — The critique is broken into discrete, actionable improvement tasks. One task per iteration.
4. **Fix** — Each task is implemented and verified with unit tests.
5. **Re-record** — After a batch of fixes, Playwright re-runs the flows and new screenshots replace the old ones, restarting the cycle.

#### Key user flows to record

- **Create a beat** — open app on a blank sheet, click cells across multiple voices and bars
- **Play back** — hit Play, observe playhead, toggle metronome on/off, hit Stop
- **Sticking** — right-click a hit cell, cycle R → L → null, observe label
- **Edit** — undo/redo a series of changes with Ctrl+Z / Ctrl+Shift+Z
- **Export / Import** — export sheet as `.doef`, import it back
- **Open saved sheet** — open the sheet list, select a saved sheet

#### Phase completion criteria

The phase is complete when:
- All six flows have Playwright specs with screenshots stored in `docs/ux-audit/`
- At least one full critique-and-fix cycle has been completed
- All unit tests still pass
- The critique document (`docs/ux-audit/critique.md`) records findings and their resolution status

### Long-term / ambitious

- **Practice mode** — play along with a metronome; app listens (mic) and scores accuracy.
- **Practice log** — track time spent on each exercise, chart progress.
- **URL sharing** — encode notation in a shareable link (no backend needed via URL hash).
- **Collaborative editing** — real-time shared sheets (needs backend).
- **Mobile / tablet** — responsive touch-first UI for practice-room use.
- **Tempo ramping** — gradually increase BPM during playback for progressive drilling.

---

## Success criteria (MVP)

1. A drummer can create a 4-bar 4/4 exercise in under 2 minutes.
2. Playback accurately reflects placed beats at the chosen BPM.
3. Saved sheets survive a browser refresh and can be reopened.
4. Printed output is legible and uses minimal ink.

## Out of scope (MVP)

- User accounts / authentication
- Backend / server
- Note durations (all hits are equal — it's a grid)
- Pitch notation (this is percussion only)
- Multi-track / layered sheets
- Audio recording
