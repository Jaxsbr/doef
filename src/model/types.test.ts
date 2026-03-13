import { describe, it, expect } from 'vitest';
import { VOICES } from './voices';
import type { VoiceId, Voice, TimeSignature, Cell, VoiceCells, Bar, Sheet } from './types';

describe('Voice registry', () => {
  it('contains exactly 9 voices', () => {
    expect(VOICES).toHaveLength(9);
  });

  it('has unique ids', () => {
    const ids = VOICES.map((v) => v.id);
    expect(new Set(ids).size).toBe(9);
  });

  it('has unique orders 0-8', () => {
    const orders = VOICES.map((v) => v.order).sort((a, b) => a - b);
    expect(orders).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('has non-empty name and abbr for every voice', () => {
    for (const v of VOICES) {
      expect(v.name.length).toBeGreaterThan(0);
      expect(v.abbr.length).toBeGreaterThan(0);
    }
  });

  it('matches spec entries', () => {
    const byId = Object.fromEntries(VOICES.map((v) => [v.id, v])) as Record<VoiceId, Voice>;
    expect(byId['hh-closed']).toMatchObject({ abbr: 'HH', order: 0 });
    expect(byId['hh-open']).toMatchObject({ abbr: 'OH', order: 1 });
    expect(byId['ride']).toMatchObject({ abbr: 'RD', order: 2 });
    expect(byId['crash']).toMatchObject({ abbr: 'CR', order: 3 });
    expect(byId['tom-hi']).toMatchObject({ abbr: 'HT', order: 4 });
    expect(byId['tom-mid']).toMatchObject({ abbr: 'MT', order: 5 });
    expect(byId['snare']).toMatchObject({ abbr: 'SD', order: 6 });
    expect(byId['tom-floor']).toMatchObject({ abbr: 'FT', order: 7 });
    expect(byId['kick']).toMatchObject({ abbr: 'KK', order: 8 });
  });

  it('every voice has a staffLine integer', () => {
    for (const v of VOICES) {
      expect(typeof v.staffLine).toBe('number');
      expect(Number.isInteger(v.staffLine)).toBe(true);
    }
  });

  it('every voice has noteheadType filled or x', () => {
    for (const v of VOICES) {
      expect(['filled', 'x']).toContain(v.noteheadType);
    }
  });

  it('cymbals use x notehead and drums use filled', () => {
    const byId = Object.fromEntries(VOICES.map((v) => [v.id, v])) as Record<VoiceId, Voice>;
    expect(byId['hh-closed'].noteheadType).toBe('x');
    expect(byId['hh-open'].noteheadType).toBe('x');
    expect(byId['ride'].noteheadType).toBe('x');
    expect(byId['crash'].noteheadType).toBe('x');
    expect(byId['snare'].noteheadType).toBe('filled');
    expect(byId['kick'].noteheadType).toBe('filled');
    expect(byId['tom-hi'].noteheadType).toBe('filled');
    expect(byId['tom-mid'].noteheadType).toBe('filled');
    expect(byId['tom-floor'].noteheadType).toBe('filled');
  });

  it('kick is below the staff (staffLine < -4)', () => {
    const byId = Object.fromEntries(VOICES.map((v) => [v.id, v])) as Record<VoiceId, Voice>;
    expect(byId['kick'].staffLine).toBeLessThan(-4);
  });

  it('cymbals are above the staff (staffLine > 4)', () => {
    const byId = Object.fromEntries(VOICES.map((v) => [v.id, v])) as Record<VoiceId, Voice>;
    expect(byId['hh-closed'].staffLine).toBeGreaterThan(4);
    expect(byId['hh-open'].staffLine).toBeGreaterThan(4);
    expect(byId['crash'].staffLine).toBeGreaterThan(4);
  });

  it('staff positions map correctly for key voices', () => {
    const byId = Object.fromEntries(VOICES.map((v) => [v.id, v])) as Record<VoiceId, Voice>;
    expect(byId['kick'].staffLine).toBe(-6);      // ledger below
    expect(byId['snare'].staffLine).toBe(-1);     // space 2
    expect(byId['tom-hi'].staffLine).toBe(3);     // space 4
    expect(byId['ride'].staffLine).toBe(4);       // line 5
    expect(byId['crash'].staffLine).toBe(6);      // ledger above
  });
});

describe('Type shape sanity checks', () => {
  it('Cell is assignable from boolean', () => {
    const hit: Cell = true;
    const rest: Cell = false;
    expect(hit).toBe(true);
    expect(rest).toBe(false);
  });

  it('VoiceCells is an array of booleans', () => {
    const row: VoiceCells = [true, false, true, false];
    expect(row).toHaveLength(4);
  });

  it('TimeSignature holds beats and subdivision', () => {
    const ts: TimeSignature = { beats: 4, subdivision: 4 };
    expect(ts.beats).toBe(4);
    expect(ts.subdivision).toBe(4);
  });

  it('Bar has voiceCells keyed by VoiceId', () => {
    const cells: VoiceCells = Array(16).fill(false);
    const bar: Bar = {
      voiceCells: {
        'hh-closed': cells,
        'hh-open': cells,
        ride: cells,
        crash: cells,
        'tom-hi': cells,
        'tom-mid': cells,
        snare: cells,
        'tom-floor': cells,
        kick: cells,
      },
    };
    expect(bar.voiceCells['kick']).toHaveLength(16);
  });

  it('Sheet holds required fields', () => {
    const sheet: Sheet = {
      id: 'abc-123',
      name: 'Test Sheet',
      timeSignature: { beats: 4, subdivision: 4 },
      bpm: 120,
      bars: [],
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
    };
    expect(sheet.id).toBe('abc-123');
    expect(sheet.bpm).toBe(120);
    expect(sheet.bars).toHaveLength(0);
  });
});
