# ADR-001: Grid-based notation over traditional staff notation

## Status

Accepted

## Context

Drum notation can be rendered as either:

1. **Traditional staff notation** — 5-line percussion clef, noteheads on specific lines/spaces, stems, beams, rests.
2. **Grid / matrix notation** — rows = drum voices, columns = subdivisions, cells toggled on/off.

The user's primary use case is short practice exercises (4–10 bars), not publishing sheet music.

## Decision

MVP uses grid-based notation.

## Rationale

- Dramatically simpler to implement and maintain.
- Intuitive click-to-toggle interaction — no drag-and-drop noteheads.
- Maps directly to the domain model (voice × subdivision = cell).
- Easier to render as SVG and print cleanly.
- Traditional staff rendering can be added later as an alternative view (see PRD blue sky).

## Consequences

- Users accustomed to reading standard notation will see an unfamiliar layout.
- Note durations are implicit from grid position, not from notehead shapes.
- Migrating to staff view later means building a second renderer, not replacing this one.
