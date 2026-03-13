import { describe, it, expect } from 'vitest';
import { cellsPerBar, createBar, createSheet } from './factory';
import { VOICES } from './voices';

const TS_4_4 = { beats: 4, subdivision: 4 };
const TS_3_4 = { beats: 3, subdivision: 4 };
const TS_6_8 = { beats: 6, subdivision: 8 };
const TS_7_8 = { beats: 7, subdivision: 8 };

describe('cellsPerBar', () => {
  it('4/4 → 16', () => expect(cellsPerBar(TS_4_4)).toBe(16));
  it('3/4 → 12', () => expect(cellsPerBar(TS_3_4)).toBe(12));
  it('6/8 → 12', () => expect(cellsPerBar(TS_6_8)).toBe(12));
  it('7/8 → 14', () => expect(cellsPerBar(TS_7_8)).toBe(14));
});

describe('createBar', () => {
  it('has all 9 voices', () => {
    const bar = createBar(TS_4_4);
    const keys = Object.keys(bar.voiceCells);
    expect(keys).toHaveLength(9);
    for (const v of VOICES) {
      expect(keys).toContain(v.id);
    }
  });

  it('each voice row has correct cell count for 4/4', () => {
    const bar = createBar(TS_4_4);
    for (const v of VOICES) {
      expect(bar.voiceCells[v.id]).toHaveLength(16);
    }
  });

  it('each voice row has correct cell count for 6/8', () => {
    const bar = createBar(TS_6_8);
    for (const v of VOICES) {
      expect(bar.voiceCells[v.id]).toHaveLength(12);
    }
  });

  it('all cells initialise to false', () => {
    const bar = createBar(TS_4_4);
    for (const v of VOICES) {
      expect(bar.voiceCells[v.id].every((c) => c === false)).toBe(true);
    }
  });
});

describe('createSheet', () => {
  it('produces correct bar count', () => {
    const sheet = createSheet('Test', TS_4_4, 120, 4);
    expect(sheet.bars).toHaveLength(4);
  });

  it('stores name, bpm, and time signature', () => {
    const sheet = createSheet('My Sheet', TS_3_4, 80, 2);
    expect(sheet.name).toBe('My Sheet');
    expect(sheet.bpm).toBe(80);
    expect(sheet.timeSignature).toEqual(TS_3_4);
  });

  it('has a non-empty UUID id', () => {
    const sheet = createSheet('X', TS_4_4, 120, 1);
    expect(sheet.id).toMatch(/^[0-9a-f-]{36}$/);
  });

  it('createdAt and updatedAt are ISO 8601 strings', () => {
    const sheet = createSheet('X', TS_4_4, 120, 1);
    expect(() => new Date(sheet.createdAt)).not.toThrow();
    expect(() => new Date(sheet.updatedAt)).not.toThrow();
  });

  it('each bar has the correct cell count', () => {
    const sheet = createSheet('X', TS_7_8, 120, 3);
    for (const bar of sheet.bars) {
      for (const v of VOICES) {
        expect(bar.voiceCells[v.id]).toHaveLength(14);
      }
    }
  });

  it('bars are independent objects (not shared references)', () => {
    const sheet = createSheet('X', TS_4_4, 120, 2);
    sheet.bars[0].voiceCells['kick'][0] = true;
    expect(sheet.bars[1].voiceCells['kick'][0]).toBe(false);
  });
});
