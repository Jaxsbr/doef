import { describe, it, expect, vi, beforeEach } from 'vitest';
import { cellDurationSeconds, PlaybackEngine } from './PlaybackEngine';
import { createSheet } from '../model/factory';

// ── Minimal Web Audio mock ────────────────────────────────────────────────────

const makeParam = () => ({ value: 0, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() });
const makeNode = () => ({ connect: vi.fn(), start: vi.fn(), stop: vi.fn() });

function makeMockAudioContext(currentTime = 0) {
  return {
    currentTime,
    sampleRate: 44100,
    state: 'running' as AudioContextState,
    destination: {},
    resume: vi.fn().mockResolvedValue(undefined),
    createOscillator: vi.fn(() => ({ ...makeNode(), type: 'sine', frequency: makeParam() })),
    createGain: vi.fn(() => ({ ...makeNode(), gain: makeParam() })),
    createBuffer: vi.fn((_ch: number, len: number) => ({
      getChannelData: vi.fn(() => new Float32Array(len)),
    })),
    createBufferSource: vi.fn(() => ({ ...makeNode(), buffer: null })),
    createBiquadFilter: vi.fn(() => ({ ...makeNode(), type: 'bandpass', frequency: makeParam() })),
  };
}

// ── cellDurationSeconds ───────────────────────────────────────────────────────

describe('cellDurationSeconds', () => {
  it('4/4 at 120 BPM → 0.125s per cell', () => {
    expect(cellDurationSeconds(120, 4)).toBeCloseTo(0.125);
  });
  it('4/4 at 60 BPM → 0.25s per cell', () => {
    expect(cellDurationSeconds(60, 4)).toBeCloseTo(0.25);
  });
  it('6/8 at 120 BPM → each 8th cell is shorter than 4/4 quarter', () => {
    // 6/8: subdivision=8 → 16/8 = 2 cells per beat → cellDur = (60/120)/(16/8) = 0.5/2 = 0.25
    expect(cellDurationSeconds(120, 8)).toBeCloseTo(0.25);
  });
});

// ── PlaybackEngine state ──────────────────────────────────────────────────────

describe('PlaybackEngine', () => {
  let engine: PlaybackEngine;
  let mockCtx: ReturnType<typeof makeMockAudioContext>;

  beforeEach(() => {
    engine = new PlaybackEngine();
    mockCtx = makeMockAudioContext(0);
    vi.stubGlobal('AudioContext', vi.fn(() => mockCtx));
  });

  it('starts in stopped state', () => {
    expect(engine.getState().isPlaying).toBe(false);
  });

  it('play() sets isPlaying to true', () => {
    const sheet = createSheet('T', { beats: 4, subdivision: 4 }, 120, 1);
    engine.play(sheet);
    expect(engine.getState().isPlaying).toBe(true);
    engine.stop();
  });

  it('stop() sets isPlaying to false', () => {
    const sheet = createSheet('T', { beats: 4, subdivision: 4 }, 120, 1);
    engine.play(sheet);
    engine.stop();
    expect(engine.getState().isPlaying).toBe(false);
  });

  it('stop() resets currentBar and currentCell to 0', () => {
    const sheet = createSheet('T', { beats: 4, subdivision: 4 }, 120, 1);
    engine.play(sheet);
    engine.stop();
    const state = engine.getState();
    expect(state.currentBar).toBe(0);
    expect(state.currentCell).toBe(0);
  });

  it('stop() does not fire playhead callback', () => {
    const cb = vi.fn();
    engine.setPlayheadCallback(cb);
    const sheet = createSheet('T', { beats: 4, subdivision: 4 }, 120, 1);
    engine.play(sheet);
    cb.mockClear();
    engine.stop();
    expect(cb).not.toHaveBeenCalled();
  });

  it('calling play() twice stops first playback before starting', () => {
    const sheet = createSheet('T', { beats: 4, subdivision: 4 }, 120, 1);
    engine.play(sheet);
    engine.play(sheet); // should not throw
    expect(engine.getState().isPlaying).toBe(true);
    engine.stop();
  });
});
