import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAutoSave } from './useAutoSave';
import { createSheet } from '../model/factory';
import * as storage from '../storage/sheetStorage';

vi.mock('../storage/sheetStorage', () => ({
  saveSheet: vi.fn(),
}));

const sheet = createSheet('T', { beats: 4, subdivision: 4 }, 120, 1);

describe('useAutoSave', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not call saveSheet immediately', () => {
    renderHook(() => useAutoSave(sheet));
    expect(storage.saveSheet).not.toHaveBeenCalled();
  });

  it('calls saveSheet after 1000ms debounce', () => {
    renderHook(() => useAutoSave(sheet));
    vi.advanceTimersByTime(1000);
    expect(storage.saveSheet).toHaveBeenCalledWith(sheet);
  });

  it('resets debounce on rapid sheet changes', () => {
    const sheet2 = createSheet('T2', { beats: 4, subdivision: 4 }, 120, 1);
    const { rerender } = renderHook(({ s }) => useAutoSave(s), {
      initialProps: { s: sheet },
    });
    vi.advanceTimersByTime(500);
    rerender({ s: sheet2 });
    vi.advanceTimersByTime(500);
    expect(storage.saveSheet).not.toHaveBeenCalled();
    vi.advanceTimersByTime(500);
    expect(storage.saveSheet).toHaveBeenCalledOnce();
    expect(storage.saveSheet).toHaveBeenCalledWith(sheet2);
  });

  it('clears timer on unmount', () => {
    const { unmount } = renderHook(() => useAutoSave(sheet));
    unmount();
    vi.advanceTimersByTime(1000);
    expect(storage.saveSheet).not.toHaveBeenCalled();
  });
});
