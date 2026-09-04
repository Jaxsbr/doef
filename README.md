# Doef

Doef is a focused, browser-based drum notation tool for writing, hearing, saving,
sharing, and printing short percussion practice exercises. The name is Afrikaans
onomatopoeia for a drum hit.

## Current capabilities

- Standard drum staff rendered as scalable SVG
- Nine drum voices on a sixteenth-note grid with count-in labels
- Five time signatures and sheets from 1 to 16 bars
- Click-to-place hits and right-click R/L sticking notation
- Synthesised Web Audio playback with BPM control, metronome, looping, and a visual playhead
- Undo, redo, clear, and keyboard shortcuts
- Automatic browser-local saving and a saved-sheet picker
- `.doef` JSON download and upload
- Ink-friendly browser printing

Doef has no backend. Application data stays in the browser's `localStorage` unless
the user exports a sheet.

## Development

Requirements: Node.js 20 or newer and npm.

```bash
npm ci
npm run dev
```

The development server is available at <http://localhost:5173>.

```bash
npm run lint      # Static checks
npm test          # Unit and component tests
npm run test:e2e  # Browser flows; requires Playwright Chromium
npm run build     # Production build
```

Install the browser used by the end-to-end suite once with:

```bash
npx playwright install chromium
```

## Docker

The Docker image pins the browser, Node runtime, and npm dependencies used by the
test environment.

```bash
docker build -t doef .
docker run --rm doef
docker run --rm doef npm run lint
docker run --rm doef npm run build
docker run --rm doef npm run test:e2e
```

To run the development server from the container:

```bash
docker run --rm -p 5173:5173 doef npm run dev -- --host 0.0.0.0
```

## Documentation

- [Product overview](docs/README.md)
- [Potential future work](docs/ROADMAP.md)

## License

[MIT](LICENSE)
