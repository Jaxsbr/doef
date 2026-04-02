# Doef

A browser-based drum notation tool for creating short percussion practice exercises.

**doef** (Afrikaans onomatopoeia for a drum hit) is built for drummers who drill exercises — paradiddles, groove patterns, fill combinations — and need a fast way to notate, hear, and print 4–10 bar passages.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Features (MVP)

- Grid-based drum notation with 16th-note resolution
- Configurable time signature and bar count
- Click to place / remove beats
- Playback with adjustable BPM (Web Audio API)
- Save and name notation sheets (browser localStorage)
- Open and edit saved sheets
- Print-friendly layout

## Tech

- React + TypeScript + Vite
- SVG rendering
- Web Audio API (no external audio deps)
- localStorage persistence
- Vitest + React Testing Library

## Project structure

See [AGENTS.md](./AGENTS.md) for the full directory map and layer rules.

## Docs

- [Product Requirements](./docs/product/PRD.md) — MVP scope and blue sky features
- [Architecture Decisions](./docs/decisions/) — ADRs logged here

<!-- build-loop -->
---
*Built with [build-loop](docs/plan/) — init pre-v4 | builds pre-v4*
