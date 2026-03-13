import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePlayback } from './usePlayback';
import { createSheet } from '../model/factory';

// Mock PlaybackEngine so tests don't need Web Audio
vi.mock('../audio/PlaybackEngine', () => {
  let _cb: ((bar: number, cell: number) => void) | null = null;
  const MockEngine = vi.fn().mockImplementation(() => ({
    setPlayheadCallback: vi.fn((cb) => { _cb = cb; }),
    play: vi.fn(),
    stop: vi.fn(),
    getState: vi.fn(() => ({ isPlaying: false, currentBar: 0, currentCell: 0, startTime: 0 })),
    // Expose internal for test helpers
    _firePlayhead: (bar: number, cell: number) => _cb?.(bar, cell),
  }));
  return { PlaybackEngine: MockEngine };
});

const sheet = createSheet('T', { beats: 4, subdivision: 4 }, 120, 2);

describe('usePlayback', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('starts with isPlaying false and activeCellIndex -1', () => {
    const { result } = renderHook(() => usePlayback());
    expect(result.current.isPlaying).toBe(false);
    expect(result.current.activeCellIndex).toBe(-1);
  });

  it('play() sets isPlaying to true', () => {
    const { result } = renderHook(() => usePlayback());
    act(() => { result.current.play(sheet); });
    expect(result.current.isPlaying).toBe(true);
  });

  it('stop() sets isPlaying to false', () => {
    const { result } = renderHook(() => usePlayback());
    act(() => { result.current.play(sheet); });
    act(() => { result.current.stop(); });
    expect(result.current.isPlaying).toBe(false);
  });

  it('stop() resets activeCellIndex to -1', () => {
    const { result } = renderHook(() => usePlayback());
    act(() => { result.current.play(sheet); });
    act(() => { result.current.stop(); });
    expect(result.current.activeCellIndex).toBe(-1);
  });

  it('exposes play and stop as stable functions', () => {
    const { result, rerender } = renderHook(() => usePlayback());
    const { play, stop } = result.current;
    rerender();
    expect(result.current.play).toBe(play);
    expect(result.current.stop).toBe(stop);
  });
});
