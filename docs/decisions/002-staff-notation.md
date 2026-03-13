# ADR-002: Replace grid notation with 5-line percussion staff notation

## Status

Accepted — supersedes ADR-001

## Context

ADR-001 chose grid-based notation for MVP simplicity. After MVP delivery, the core use-case requirement became clearer: drum students need to **read** standard notation as part of their practice, not just click cells. A grid layout does not teach note reading; a 5-line percussion staff does.

## Decision

Replace the grid renderer with a standard 5-line percussion staff renderer. Each drum voice maps to a conventional notehead position on the staff (e.g. kick = below first ledger line, snare = third space, hi-hat closed = above fifth line with × notehead). Hits within a bar are rendered as filled noteheads or × noteheads at their subdivision position, beamed appropriately.

## Rationale

- Drum students learning to read notation need to practice from notation they can recognise in real sheet music.
- The app becomes a notation tool rather than just a sequencer trigger pad.
- Notation reading is a deliberate learning goal, not an obstacle to usability.
- The domain model (voice × subdivision × bar) maps cleanly onto standard percussion notation.

## Consequences

- The `DrumGrid` SVG component is replaced by a `StaffNotation` component.
- Voice-to-staff-position mapping must be defined (e.g. `voices.ts` extended with staff position and notehead type).
- Beaming logic is required for subdivisions within a beat.
- Tests for the new renderer replace the existing DrumGrid tests.
- The grid spec (`docs/spec/svg-grid.md`) is superseded by a staff notation spec.
- Playback, storage, controls, and the domain model are unaffected.
