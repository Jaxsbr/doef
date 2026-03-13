import { useEffect, useRef } from 'react';
import { saveSheet } from '../storage/sheetStorage';
import type { Sheet } from '../model/types';

const DEBOUNCE_MS = 1000;

/**
 * Auto-saves `sheet` to localStorage whenever it changes.
 * Debounced by DEBOUNCE_MS to avoid thrashing on rapid cell toggles.
 */
export function useAutoSave(sheet: Sheet): void {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current !== null) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      saveSheet(sheet);
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, [sheet]);
}
