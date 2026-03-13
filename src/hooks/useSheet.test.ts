import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSheet } from './useSheet';
import { createSheet } from '../model/factory';

const makeSheet = () => createSheet('Test', { beats: 4, subdivision: 4 }, 120, 2);

describe('useSheet', () => {
  it('returns the initial sheet', () => {
    const initial = makeSheet();
    const { result } = renderHook(() => useSheet(initial));
    expect(result.current.sheet).toBe(initial);
  });

  it('toggleCell turns a false cell to true', () => {
    const { result } = renderHook(() => useSheet(makeSheet()));
    act(() => {
      result.current.toggleCell(0, 'kick', 0);
    });
    expect(result.current.sheet.bars[0].voiceCells['kick'][0]).toBe(true);
  });

  it('toggleCell turns a true cell back to false', () => {
    const { result } = renderHook(() => useSheet(makeSheet()));
    act(() => { result.current.toggleCell(0, 'snare', 2); });
    act(() => { result.current.toggleCell(0, 'snare', 2); });
    expect(result.current.sheet.bars[0].voiceCells['snare'][2]).toBe(false);
  });

  it('toggleCell only mutates the targeted bar and voice', () => {
    const { result } = renderHook(() => useSheet(makeSheet()));
    const before = result.current.sheet.bars[1].voiceCells['kick'][0];
    act(() => { result.current.toggleCell(0, 'kick', 0); });
    expect(result.current.sheet.bars[1].voiceCells['kick'][0]).toBe(before);
  });

  it('toggleCell only mutates the targeted cell index', () => {
    const { result } = renderHook(() => useSheet(makeSheet()));
    act(() => { result.current.toggleCell(0, 'hh-closed', 3); });
    expect(result.current.sheet.bars[0].voiceCells['hh-closed'][0]).toBe(false);
    expect(result.current.sheet.bars[0].voiceCells['hh-closed'][3]).toBe(true);
  });

  it('setSheet replaces the sheet', () => {
    const { result } = renderHook(() => useSheet(makeSheet()));
    const next = makeSheet();
    act(() => { result.current.setSheet(next); });
    expect(result.current.sheet).toBe(next);
  });

  it('setBpm updates the bpm', () => {
    const { result } = renderHook(() => useSheet(makeSheet()));
    act(() => { result.current.setBpm(140); });
    expect(result.current.sheet.bpm).toBe(140);
  });

  it('setBpm does not mutate bars', () => {
    const { result } = renderHook(() => useSheet(makeSheet()));
    const barsBefore = result.current.sheet.bars;
    act(() => { result.current.setBpm(80); });
    expect(result.current.sheet.bars).toEqual(barsBefore);
  });

  it('setTimeSignature updates timeSignature', () => {
    const { result } = renderHook(() => useSheet(makeSheet()));
    act(() => { result.current.setTimeSignature({ beats: 3, subdivision: 4 }); });
    expect(result.current.sheet.timeSignature).toEqual({ beats: 3, subdivision: 4 });
  });

  it('setTimeSignature rebuilds bars with correct cell count', () => {
    const { result } = renderHook(() => useSheet(makeSheet()));
    act(() => { result.current.setTimeSignature({ beats: 6, subdivision: 8 }); });
    // 6/8 → 6 * (16/8) = 12 cells
    for (const bar of result.current.sheet.bars) {
      expect(bar.voiceCells['kick']).toHaveLength(12);
    }
  });

  it('setTimeSignature preserves bar count', () => {
    const { result } = renderHook(() => useSheet(makeSheet()));
    const barCount = result.current.sheet.bars.length;
    act(() => { result.current.setTimeSignature({ beats: 3, subdivision: 4 }); });
    expect(result.current.sheet.bars).toHaveLength(barCount);
  });

  it('setBarCount increases bar count', () => {
    const { result } = renderHook(() => useSheet(makeSheet()));
    act(() => { result.current.setBarCount(6); });
    expect(result.current.sheet.bars).toHaveLength(6);
  });

  it('setBarCount decreases bar count', () => {
    const { result } = renderHook(() => useSheet(makeSheet()));
    act(() => { result.current.setBarCount(1); });
    expect(result.current.sheet.bars).toHaveLength(1);
  });

  it('setBarCount clamps to 1 minimum', () => {
    const { result } = renderHook(() => useSheet(makeSheet()));
    act(() => { result.current.setBarCount(0); });
    expect(result.current.sheet.bars).toHaveLength(1);
  });

  it('setBarCount clamps to 16 maximum', () => {
    const { result } = renderHook(() => useSheet(makeSheet()));
    act(() => { result.current.setBarCount(20); });
    expect(result.current.sheet.bars).toHaveLength(16);
  });

  it('setBarCount new bars have correct cell count', () => {
    const { result } = renderHook(() => useSheet(makeSheet()));
    act(() => { result.current.setBarCount(3); });
    expect(result.current.sheet.bars[2].voiceCells['kick']).toHaveLength(16);
  });

  it('setName updates the sheet name', () => {
    const { result } = renderHook(() => useSheet(makeSheet()));
    act(() => { result.current.setName('My Beat'); });
    expect(result.current.sheet.name).toBe('My Beat');
  });

  it('setName does not mutate bars', () => {
    const { result } = renderHook(() => useSheet(makeSheet()));
    const barsBefore = result.current.sheet.bars;
    act(() => { result.current.setName('Renamed'); });
    expect(result.current.sheet.bars).toEqual(barsBefore);
  });
});
