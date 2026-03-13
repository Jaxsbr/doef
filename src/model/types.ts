export type VoiceId =
  | 'hh-closed'
  | 'hh-open'
  | 'snare'
  | 'kick'
  | 'tom-hi'
  | 'tom-mid'
  | 'tom-floor'
  | 'crash'
  | 'ride';

export interface Voice {
  id: VoiceId;
  name: string;
  abbr: string;
  order: number;
  /** Half-step position on the staff. 0 = middle line (line 3). Positive = up, negative = down. */
  staffLine: number;
  /** Notehead shape: filled oval for drums/toms, × for cymbals */
  noteheadType: 'filled' | 'x';
}

export interface TimeSignature {
  beats: number;
  subdivision: number;
}

export type Cell = boolean;

export type VoiceCells = Cell[];

export type Sticking = 'R' | 'L' | null;

export interface Bar {
  voiceCells: Record<VoiceId, VoiceCells>;
  voiceSticking?: Partial<Record<VoiceId, Sticking[]>>;
}

export interface Sheet {
  id: string;
  name: string;
  timeSignature: TimeSignature;
  bpm: number;
  bars: Bar[];
  createdAt: string;
  updatedAt: string;
}
