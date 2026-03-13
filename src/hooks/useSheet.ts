import { useReducer, useCallback } from 'react';
import type { Sheet, Bar, VoiceId, TimeSignature, Sticking } from '../model/types';
import { createBar } from '../model/factory';

export interface UseSheetReturn {
  sheet: Sheet;
  setSheet: (sheet: Sheet) => void;
  toggleCell: (barIndex: number, voice: VoiceId, cellIndex: number) => void;
  toggleSticking: (barIndex: number, voice: VoiceId, cellIndex: number) => void;
  clearSheet: () => void;
  setBpm: (bpm: number) => void;
  setTimeSignature: (ts: TimeSignature) => void;
  setBarCount: (n: number) => void;
  setName: (name: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
}

interface HistoryState {
  past: Sheet[];
  present: Sheet;
  future: Sheet[];
}

type HistoryAction =
  | { type: 'update'; transform: (prev: Sheet) => Sheet }
  | { type: 'set'; sheet: Sheet }
  | { type: 'undo' }
  | { type: 'redo' };

function historyReducer(state: HistoryState, action: HistoryAction): HistoryState {
  switch (action.type) {
    case 'update': {
      const next = action.transform(state.present);
      return { past: [...state.past, state.present], present: next, future: [] };
    }
    case 'set':
      return { past: [...state.past, state.present], present: action.sheet, future: [] };
    case 'undo': {
      if (state.past.length === 0) return state;
      const prev = state.past[state.past.length - 1];
      return { past: state.past.slice(0, -1), present: prev, future: [state.present, ...state.future] };
    }
    case 'redo': {
      if (state.future.length === 0) return state;
      const [next, ...rest] = state.future;
      return { past: [...state.past, state.present], present: next, future: rest };
    }
  }
}

export function useSheet(initialSheet: Sheet): UseSheetReturn {
  const [history, dispatch] = useReducer(historyReducer, {
    past: [],
    present: initialSheet,
    future: [],
  });

  const sheet = history.present;
  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const setSheet = useCallback((s: Sheet) => dispatch({ type: 'set', sheet: s }), []);

  const toggleCell = useCallback((barIndex: number, voice: VoiceId, cellIndex: number) => {
    dispatch({
      type: 'update',
      transform: (prev) => {
        const bars = prev.bars.map((bar, bi) => {
          if (bi !== barIndex) return bar;
          const cells = bar.voiceCells[voice].map((cell, ci) =>
            ci === cellIndex ? !cell : cell,
          );
          return { ...bar, voiceCells: { ...bar.voiceCells, [voice]: cells } };
        });
        return { ...prev, bars, updatedAt: new Date().toISOString() };
      },
    });
  }, []);

  const toggleSticking = useCallback((barIndex: number, voice: VoiceId, cellIndex: number) => {
    dispatch({
      type: 'update',
      transform: (prev) => {
        const bars = prev.bars.map((bar, bi) => {
          if (bi !== barIndex) return bar;
          const cellCount = bar.voiceCells[voice].length;
          const currentRow: Sticking[] = bar.voiceSticking?.[voice] ?? Array<Sticking>(cellCount).fill(null);
          const current = currentRow[cellIndex] ?? null;
          const next: Sticking = current === null ? 'R' : current === 'R' ? 'L' : null;
          const newRow = currentRow.map((s, ci) => (ci === cellIndex ? next : s));
          return { ...bar, voiceSticking: { ...(bar.voiceSticking ?? {}), [voice]: newRow } };
        });
        return { ...prev, bars, updatedAt: new Date().toISOString() };
      },
    });
  }, []);

  const clearSheet = useCallback(() => {
    dispatch({
      type: 'update',
      transform: (prev) => ({
        ...prev,
        bars: prev.bars.map((bar) => ({
          ...bar,
          voiceCells: Object.fromEntries(
            Object.entries(bar.voiceCells).map(([v, cells]) => [v, cells.map(() => false)]),
          ) as Bar['voiceCells'],
          voiceSticking: undefined,
        })),
        updatedAt: new Date().toISOString(),
      }),
    });
  }, []);

  const setBpm = useCallback((bpm: number) => {
    dispatch({
      type: 'update',
      transform: (prev) => ({ ...prev, bpm, updatedAt: new Date().toISOString() }),
    });
  }, []);

  const setTimeSignature = useCallback((ts: TimeSignature) => {
    dispatch({
      type: 'update',
      transform: (prev) => ({
        ...prev,
        timeSignature: ts,
        bars: prev.bars.map(() => createBar(ts)),
        updatedAt: new Date().toISOString(),
      }),
    });
  }, []);

  const setBarCount = useCallback((n: number) => {
    const clamped = Math.max(1, Math.min(16, n));
    dispatch({
      type: 'update',
      transform: (prev) => {
        const current = prev.bars.length;
        let bars = prev.bars;
        if (clamped > current) {
          const extra = Array.from({ length: clamped - current }, () => createBar(prev.timeSignature));
          bars = [...bars, ...extra];
        } else if (clamped < current) {
          bars = bars.slice(0, clamped);
        }
        return { ...prev, bars, updatedAt: new Date().toISOString() };
      },
    });
  }, []);

  const setName = useCallback((name: string) => {
    dispatch({
      type: 'update',
      transform: (prev) => ({ ...prev, name, updatedAt: new Date().toISOString() }),
    });
  }, []);

  const undo = useCallback(() => dispatch({ type: 'undo' }), []);
  const redo = useCallback(() => dispatch({ type: 'redo' }), []);

  return { sheet, setSheet, toggleCell, toggleSticking, clearSheet, setBpm, setTimeSignature, setBarCount, setName, canUndo, canRedo, undo, redo };
}
