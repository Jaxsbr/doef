# Product overview

Doef is a fast notation scratchpad for drummers and students who want to write
short exercises without opening a full digital audio workstation or traditional
score editor. A sheet contains 1–16 bars, a time signature, a tempo, and hits for
nine common drum voices on a sixteenth-note grid.

The application renders a printable SVG staff and synthesises playback in the
browser. Users can add sticking, adjust tempo, hear a metronome, undo edits, save
sheets locally, and move sheets between browsers with `.doef` JSON files.

## Technical shape

- React and TypeScript, built with Vite
- Pure domain model separated from React
- SVG notation and print-specific CSS
- Web Audio API playback with no audio service or bundled samples
- `localStorage` persistence with file import and export
- Vitest unit/component tests and Playwright browser flows
- No backend, accounts, or network persistence

The current file importer parses JSON but does not yet validate its structure or
manage schema versions. Imported data should therefore be treated as trusted until
that roadmap item is implemented.
