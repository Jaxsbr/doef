import type { Sheet } from '../model/types';

const KEYS = {
  index: 'doef:sheets',
  sheet: (id: string) => `doef:sheet:${id}`,
} as const;

function readIndex(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEYS.index) ?? '[]') as string[];
  } catch {
    return [];
  }
}

function writeIndex(ids: string[]): void {
  localStorage.setItem(KEYS.index, JSON.stringify(ids));
}

export function saveSheet(sheet: Sheet): void {
  const now = new Date().toISOString();
  const toSave: Sheet = { ...sheet, updatedAt: now };
  localStorage.setItem(KEYS.sheet(sheet.id), JSON.stringify(toSave));
  const ids = readIndex();
  if (!ids.includes(sheet.id)) {
    writeIndex([...ids, sheet.id]);
  }
}

export function loadSheet(id: string): Sheet | null {
  const raw = localStorage.getItem(KEYS.sheet(id));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Sheet;
  } catch {
    return null;
  }
}

export interface SheetMeta {
  id: string;
  name: string;
  updatedAt: string;
}

export function listSheets(): SheetMeta[] {
  return readIndex()
    .map((id) => loadSheet(id))
    .filter((s): s is Sheet => s !== null)
    .map(({ id, name, updatedAt }) => ({ id, name, updatedAt }));
}

export function deleteSheet(id: string): void {
  localStorage.removeItem(KEYS.sheet(id));
  writeIndex(readIndex().filter((existingId) => existingId !== id));
}

export function exportSheet(sheet: Sheet): string {
  return JSON.stringify(sheet, null, 2);
}

export function importSheet(json: string): Sheet {
  return JSON.parse(json) as Sheet;
}
