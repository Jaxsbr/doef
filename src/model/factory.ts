import type { Bar, Sheet, TimeSignature, VoiceId, VoiceCells, Sticking } from './types';
import { VOICES } from './voices';

export function cellsPerBar(ts: TimeSignature): number {
  return ts.beats * (16 / ts.subdivision);
}

export function createBar(ts: TimeSignature): Bar {
  const count = cellsPerBar(ts);
  const voiceCells = Object.fromEntries(
    VOICES.map((v): [VoiceId, VoiceCells] => [v.id, Array(count).fill(false)]),
  ) as Record<VoiceId, VoiceCells>;
  const voiceSticking = Object.fromEntries(
    VOICES.map((v): [VoiceId, Sticking[]] => [v.id, Array<Sticking>(count).fill(null)]),
  ) as Record<VoiceId, Sticking[]>;
  return { voiceCells, voiceSticking };
}

export function createSheet(
  name: string,
  ts: TimeSignature,
  bpm: number,
  barCount: number,
): Sheet {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name,
    timeSignature: ts,
    bpm,
    bars: Array.from({ length: barCount }, () => createBar(ts)),
    createdAt: now,
    updatedAt: now,
  };
}
