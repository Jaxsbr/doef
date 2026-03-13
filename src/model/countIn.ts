import type { TimeSignature } from './types';

/** Syllable labels for positions within a beat at 16th-note resolution */
const BEAT_SYLLABLES: Record<number, string[]> = {
  4: ['', 'e', 'and', 'a'],  // quarter-beat subdivision (4/4, 3/4, 5/4…)
  2: ['', 'and'],              // eighth-beat subdivision (6/8, 7/8…)
  1: [''],                     // beat = cell (unusual)
};

/**
 * Returns a count-in label string for every cell in one bar.
 *
 * Examples (4/4, subdivision=4):
 *   ["1","e","and","a","2","e","and","a","3","e","and","a","4","e","and","a"]
 *
 * Examples (6/8, subdivision=8):
 *   ["1","and","2","and","3","and","4","and","5","and","6","and"]
 *
 * Beat numbers use the beat ordinal (1-based). Inner positions use the syllable
 * from the table above; beat position 0 is replaced by the beat number string.
 */
export function countInLabels(ts: TimeSignature): string[] {
  const cellsPerBeat = 16 / ts.subdivision;
  const syllables = BEAT_SYLLABLES[cellsPerBeat] ?? Array(cellsPerBeat).fill('');
  const labels: string[] = [];

  for (let beat = 0; beat < ts.beats; beat++) {
    for (let pos = 0; pos < cellsPerBeat; pos++) {
      labels.push(pos === 0 ? String(beat + 1) : syllables[pos]);
    }
  }

  return labels;
}
