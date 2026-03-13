# Data Model Specification

## Core Types

```typescript
type VoiceId = 'hh-closed' | 'hh-open' | 'snare' | 'kick' | 'tom-hi' | 'tom-mid' | 'tom-floor' | 'crash' | 'ride';

interface Voice {
  id: VoiceId;
  name: string;       // "Hi-Hat (Closed)"
  abbr: string;       // "HH"
  order: number;      // Display order top-to-bottom (0 = top)
}

interface TimeSignature {
  beats: number;       // Numerator (e.g. 4 in 4/4)
  subdivision: number; // Denominator (e.g. 4 in 4/4)
}

// A single cell: true = hit, false = rest
type Cell = boolean;

// One voice's row within a bar: array of cells
// Length = beats * (16 / subdivision) for 16th-note resolution
type VoiceCells = Cell[];

// One bar: map from VoiceId to that voice's cells
interface Bar {
  voiceCells: Record<VoiceId, VoiceCells>;
}

interface Sheet {
  id: string;              // UUID
  name: string;            // User-given name
  timeSignature: TimeSignature;
  bpm: number;             // 30–300
  bars: Bar[];             // Ordered list of bars
  createdAt: string;       // ISO 8601
  updatedAt: string;       // ISO 8601
}
```

## Derived Calculations

```typescript
// Cells per bar = timeSignature.beats * (16 / timeSignature.subdivision)
// e.g. 4/4 = 4 * 4 = 16 cells
// e.g. 3/4 = 3 * 4 = 12 cells
// e.g. 6/8 = 6 * 2 = 12 cells
// e.g. 7/8 = 7 * 2 = 14 cells

// Cell duration (ms) = (60000 / bpm) / (16 / timeSignature.subdivision)
// e.g. 120 BPM in 4/4: (60000 / 120) / 4 = 125ms per cell
```

## Voice Registry (MVP)

| VoiceId | Name | Abbr | Order |
|---------|------|------|-------|
| hh-closed | Hi-Hat (Closed) | HH | 0 |
| hh-open | Hi-Hat (Open) | OH | 1 |
| ride | Ride | RD | 2 |
| crash | Crash | CR | 3 |
| tom-hi | High Tom | HT | 4 |
| tom-mid | Mid Tom | MT | 5 |
| snare | Snare | SD | 6 |
| tom-floor | Floor Tom | FT | 7 |
| kick | Kick | KK | 8 |

Order follows standard drum notation convention: cymbals top, snare middle, kick bottom.
