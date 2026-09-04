# Doef engineering guide

Doef is a client-only React and TypeScript application for short drum-notation
practice sheets.

## Durable constraints

- Keep the application browser-only unless a task explicitly changes that product decision.
- Render notation with SVG so it remains scalable and print-friendly.
- Use the Web Audio API rather than an external audio service.
- Keep printed sheets legible and ink-friendly through `@media print` styles.
- Preserve the existing layer direction: `model` is pure TypeScript; `audio` and
  `storage` depend only on `model`; hooks coordinate those layers; components do
  not access audio or storage directly.
- Add or update tests when behavior changes.
- Use conventional commit prefixes such as `feat:`, `fix:`, `test:`, and `chore:`.

## Project layout

```text
src/
├── audio/       Web Audio playback
├── components/  React and SVG presentation
├── hooks/       Application coordination and state
├── model/       Pure domain types and logic
├── storage/     localStorage and file serialization
└── App.tsx      Root UI
```

## Verification

```bash
npm run lint
npm test
npm run build
npm run test:e2e
```

The same checks can be run in the pinned Docker environment described in
`README.md`.
