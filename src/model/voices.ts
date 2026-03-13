import type { Voice } from './types';

// staffLine: half-step position on a 5-line staff. 0 = middle line (line 3).
// Lines at: -4, -2, 0, +2, +4. Spaces at: -3, -1, +1, +3.
// Ledger below: -6. Space below staff: -5. Space above staff: +5. Ledger above: +6.
export const VOICES: Voice[] = [
  { id: 'hh-closed',  name: 'Hi-Hat (Closed)', abbr: 'HH', order: 0, staffLine:  5, noteheadType: 'x'      },
  { id: 'hh-open',    name: 'Hi-Hat (Open)',   abbr: 'OH', order: 1, staffLine:  5, noteheadType: 'x'      },
  { id: 'ride',       name: 'Ride',             abbr: 'RD', order: 2, staffLine:  4, noteheadType: 'x'      },
  { id: 'crash',      name: 'Crash',            abbr: 'CR', order: 3, staffLine:  6, noteheadType: 'x'      },
  { id: 'tom-hi',     name: 'High Tom',         abbr: 'HT', order: 4, staffLine:  3, noteheadType: 'filled' },
  { id: 'tom-mid',    name: 'Mid Tom',          abbr: 'MT', order: 5, staffLine:  1, noteheadType: 'filled' },
  { id: 'snare',      name: 'Snare',            abbr: 'SD', order: 6, staffLine: -1, noteheadType: 'filled' },
  { id: 'tom-floor',  name: 'Floor Tom',        abbr: 'FT', order: 7, staffLine: -3, noteheadType: 'filled' },
  { id: 'kick',       name: 'Kick',             abbr: 'KK', order: 8, staffLine: -6, noteheadType: 'filled' },
];
