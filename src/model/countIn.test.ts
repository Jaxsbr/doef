import { describe, it, expect } from 'vitest';
import { countInLabels } from './countIn';

describe('countInLabels', () => {
  describe('4/4 (subdivision=4, 16 cells)', () => {
    const ts = { beats: 4, subdivision: 4 };

    it('returns 16 labels', () => {
      expect(countInLabels(ts)).toHaveLength(16);
    });

    it('labels beat downbeats correctly', () => {
      const labels = countInLabels(ts);
      expect(labels[0]).toBe('1');
      expect(labels[4]).toBe('2');
      expect(labels[8]).toBe('3');
      expect(labels[12]).toBe('4');
    });

    it('labels 16th-note subdivisions correctly', () => {
      const labels = countInLabels(ts);
      expect(labels[1]).toBe('e');
      expect(labels[2]).toBe('and');
      expect(labels[3]).toBe('a');
      expect(labels[5]).toBe('e');
      expect(labels[6]).toBe('and');
      expect(labels[7]).toBe('a');
    });

    it('produces exact full sequence', () => {
      expect(countInLabels(ts)).toEqual([
        '1', 'e', 'and', 'a',
        '2', 'e', 'and', 'a',
        '3', 'e', 'and', 'a',
        '4', 'e', 'and', 'a',
      ]);
    });
  });

  describe('3/4 (subdivision=4, 12 cells)', () => {
    const ts = { beats: 3, subdivision: 4 };

    it('returns 12 labels', () => {
      expect(countInLabels(ts)).toHaveLength(12);
    });

    it('produces exact full sequence', () => {
      expect(countInLabels(ts)).toEqual([
        '1', 'e', 'and', 'a',
        '2', 'e', 'and', 'a',
        '3', 'e', 'and', 'a',
      ]);
    });
  });

  describe('6/8 (subdivision=8, 12 cells)', () => {
    const ts = { beats: 6, subdivision: 8 };

    it('returns 12 labels', () => {
      expect(countInLabels(ts)).toHaveLength(12);
    });

    it('labels beat downbeats and "and" syllables', () => {
      expect(countInLabels(ts)).toEqual([
        '1', 'and',
        '2', 'and',
        '3', 'and',
        '4', 'and',
        '5', 'and',
        '6', 'and',
      ]);
    });
  });

  describe('5/4 (subdivision=4, 20 cells)', () => {
    const ts = { beats: 5, subdivision: 4 };

    it('returns 20 labels', () => {
      expect(countInLabels(ts)).toHaveLength(20);
    });

    it('starts each beat with the correct number', () => {
      const labels = countInLabels(ts);
      [0, 4, 8, 12, 16].forEach((idx, beat) => {
        expect(labels[idx]).toBe(String(beat + 1));
      });
    });
  });

  describe('7/8 (subdivision=8, 14 cells)', () => {
    const ts = { beats: 7, subdivision: 8 };

    it('returns 14 labels', () => {
      expect(countInLabels(ts)).toHaveLength(14);
    });

    it('alternates beat number and "and"', () => {
      const labels = countInLabels(ts);
      expect(labels[0]).toBe('1');
      expect(labels[1]).toBe('and');
      expect(labels[6]).toBe('4');
      expect(labels[13]).toBe('and');
    });
  });
});
