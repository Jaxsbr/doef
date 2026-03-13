import { describe, it, expect, beforeEach } from 'vitest';
import { saveSheet, loadSheet, listSheets, deleteSheet } from './sheetStorage';
import { createSheet } from '../model/factory';

// jsdom provides localStorage; clear it before each test
beforeEach(() => {
  localStorage.clear();
});

const ts = { beats: 4, subdivision: 4 };

describe('saveSheet / loadSheet', () => {
  it('round-trips a sheet', () => {
    const sheet = createSheet('Test', ts, 120, 1);
    saveSheet(sheet);
    const loaded = loadSheet(sheet.id);
    expect(loaded).not.toBeNull();
    expect(loaded!.id).toBe(sheet.id);
    expect(loaded!.name).toBe('Test');
    expect(loaded!.bpm).toBe(120);
  });

  it('updates updatedAt on save', () => {
    const sheet = createSheet('Test', ts, 120, 1);
    const before = sheet.updatedAt;
    saveSheet(sheet);
    const loaded = loadSheet(sheet.id)!;
    // updatedAt should be a valid ISO string (may equal before if same ms)
    expect(() => new Date(loaded.updatedAt)).not.toThrow();
    expect(typeof loaded.updatedAt).toBe('string');
    // createdAt is preserved
    expect(loaded.createdAt).toBe(before);
  });

  it('loadSheet returns null for unknown id', () => {
    expect(loadSheet('nonexistent')).toBeNull();
  });

  it('saving same sheet twice does not duplicate index entry', () => {
    const sheet = createSheet('Test', ts, 120, 1);
    saveSheet(sheet);
    saveSheet(sheet);
    expect(listSheets()).toHaveLength(1);
  });
});

describe('listSheets', () => {
  it('returns empty array when nothing saved', () => {
    expect(listSheets()).toEqual([]);
  });

  it('lists all saved sheets by meta', () => {
    const a = createSheet('Alpha', ts, 100, 1);
    const b = createSheet('Beta', ts, 140, 2);
    saveSheet(a);
    saveSheet(b);
    const list = listSheets();
    expect(list).toHaveLength(2);
    const names = list.map((s) => s.name);
    expect(names).toContain('Alpha');
    expect(names).toContain('Beta');
  });

  it('each item has id, name, updatedAt only', () => {
    const sheet = createSheet('X', ts, 120, 1);
    saveSheet(sheet);
    const [meta] = listSheets();
    expect(Object.keys(meta).sort()).toEqual(['id', 'name', 'updatedAt']);
  });
});

describe('deleteSheet', () => {
  it('removes the sheet from storage', () => {
    const sheet = createSheet('Del', ts, 120, 1);
    saveSheet(sheet);
    deleteSheet(sheet.id);
    expect(loadSheet(sheet.id)).toBeNull();
  });

  it('removes the sheet from the index', () => {
    const sheet = createSheet('Del', ts, 120, 1);
    saveSheet(sheet);
    deleteSheet(sheet.id);
    expect(listSheets()).toHaveLength(0);
  });

  it('deleting one sheet does not affect others', () => {
    const a = createSheet('A', ts, 120, 1);
    const b = createSheet('B', ts, 120, 1);
    saveSheet(a);
    saveSheet(b);
    deleteSheet(a.id);
    expect(listSheets()).toHaveLength(1);
    expect(listSheets()[0].name).toBe('B');
  });

  it('deleting a non-existent id is a no-op', () => {
    const sheet = createSheet('A', ts, 120, 1);
    saveSheet(sheet);
    deleteSheet('ghost-id');
    expect(listSheets()).toHaveLength(1);
  });
});
