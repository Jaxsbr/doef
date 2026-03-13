# ADR-002: Tech stack — React + Vite + SVG + Web Audio

## Status

Accepted

## Context

Doef is a client-only browser app. It needs:
- Interactive grid rendering (click to toggle cells)
- Audio playback (percussive sounds at precise timing)
- Print support
- Local persistence

## Decision

- **React + TypeScript** for UI composition and state management.
- **Vite** for build tooling.
- **SVG** for notation rendering.
- **Web Audio API** for playback.
- **localStorage** for persistence.
- **Vitest + React Testing Library** for testing.

## Rationale

- React + TS is "boring" stable tech with deep agent training coverage.
- SVG scales to any display/print resolution and is DOM-accessible for interaction.
- Web Audio API provides sample-accurate timing without external libraries.
- localStorage requires zero infrastructure.
- Vite + Vitest share config and are fast.

## Consequences

- No backend means no cross-device sync in MVP. Mitigated by future file export/import.
- Web Audio API requires user gesture to start AudioContext (browser policy). Playback button satisfies this.
- SVG performance could degrade with very large sheets (100+ bars). Not a concern for 4–10 bar exercises.
