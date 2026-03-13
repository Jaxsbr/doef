import { useState, useRef, useEffect, useCallback } from 'react';
import { PlaybackEngine } from '../audio/PlaybackEngine';
import { cellsPerBar } from '../model/factory';
import type { Sheet } from '../model/types';

export interface UsePlaybackReturn {
  isPlaying: boolean;
  /** Global cell index across all bars, -1 when stopped */
  activeCellIndex: number;
  metronomeOn: boolean;
  play: (sheet: Sheet) => void;
  stop: () => void;
  toggleMetronome: () => void;
}

export function usePlayback(): UsePlaybackReturn {
  const engineRef = useRef<PlaybackEngine | null>(null);
  const rafRef = useRef<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeCellIndex, setActiveCellIndex] = useState(-1);
  const [metronomeOn, setMetronomeOn] = useState(false);

  if (!engineRef.current) {
    engineRef.current = new PlaybackEngine();
  }

  useEffect(() => {
    const engine = engineRef.current!;
    engine.setPlayheadCallback((bar, cell) => {
      // Drive visual updates via rAF for smooth rendering
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const { timeSignature } = engine.getState() as { timeSignature?: Sheet['timeSignature'] };
        // Compute global cell offset; if timeSignature not available, fall back to bar*16
        const cellCount = timeSignature ? cellsPerBar(timeSignature) : 16;
        setActiveCellIndex(bar * cellCount + cell);
      });
    });

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      engine.stop();
    };
  }, []);

  const play = useCallback((sheet: Sheet) => {
    const engine = engineRef.current!;
    // Override playhead callback with sheet-aware version
    engine.setPlayheadCallback((bar, cell) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        const count = cellsPerBar(sheet.timeSignature);
        setActiveCellIndex(bar * count + cell);
      });
    });
    engine.play(sheet);
    setIsPlaying(true);
  }, []);

  const stop = useCallback(() => {
    engineRef.current!.stop();
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setIsPlaying(false);
    setActiveCellIndex(-1);
  }, []);

  const toggleMetronome = useCallback(() => {
    setMetronomeOn((prev) => {
      const next = !prev;
      engineRef.current!.setMetronome(next);
      return next;
    });
  }, []);

  return { isPlaying, activeCellIndex, metronomeOn, play, stop, toggleMetronome };
}
