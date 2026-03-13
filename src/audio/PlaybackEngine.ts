import type { Sheet, VoiceId } from '../model/types';
import { cellsPerBar } from '../model/factory';

export interface PlaybackState {
  isPlaying: boolean;
  currentBar: number;
  currentCell: number;
  startTime: number;
}

export type PlayheadCallback = (bar: number, cell: number) => void;

const SCHEDULE_AHEAD = 0.1; // seconds to look ahead
const TIMER_INTERVAL = 25;  // ms between scheduler ticks

/** Duration of one 16th-note cell in seconds. Pure utility — no side effects. */
export function cellDurationSeconds(bpm: number, subdivision: number): number {
  return (60 / bpm) / (16 / subdivision);
}

export class PlaybackEngine {
  private ctx: AudioContext | null = null;
  private timerId: ReturnType<typeof setInterval> | null = null;
  private sheet: Sheet | null = null;
  private nextCellTime = 0;
  private nextBar = 0;
  private nextCell = 0;
  private onPlayhead: PlayheadCallback | null = null;
  private metronomeEnabled = false;

  private state: PlaybackState = {
    isPlaying: false,
    currentBar: 0,
    currentCell: 0,
    startTime: 0,
  };

  setPlayheadCallback(cb: PlayheadCallback): void {
    this.onPlayhead = cb;
  }

  setMetronome(enabled: boolean): void {
    this.metronomeEnabled = enabled;
  }

  play(sheet: Sheet): void {
    if (this.state.isPlaying) this.stop();

    if (!this.ctx) {
      this.ctx = new AudioContext();
    } else if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }

    this.sheet = sheet;
    this.nextBar = 0;
    this.nextCell = 0;
    this.nextCellTime = this.ctx.currentTime;
    this.state = {
      isPlaying: true,
      currentBar: 0,
      currentCell: 0,
      startTime: this.ctx.currentTime,
    };

    this.timerId = setInterval(() => { this.scheduleTick(); }, TIMER_INTERVAL);
  }

  stop(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    this.state = { ...this.state, isPlaying: false, currentBar: 0, currentCell: 0 };
  }

  getState(): Readonly<PlaybackState> {
    return this.state;
  }

  private scheduleTick(): void {
    if (!this.ctx || !this.sheet) return;

    const { bpm, timeSignature, bars } = this.sheet;
    const cellDur = cellDurationSeconds(bpm, timeSignature.subdivision);
    const totalCells = cellsPerBar(timeSignature);
    const beatInterval = 16 / timeSignature.subdivision;
    const lookAhead = this.ctx.currentTime + SCHEDULE_AHEAD;

    while (this.nextCellTime < lookAhead) {
      const bar = bars[this.nextBar];
      if (bar) {
        for (const voiceId of Object.keys(bar.voiceCells) as VoiceId[]) {
          if (bar.voiceCells[voiceId][this.nextCell]) {
            this.triggerVoice(voiceId, this.nextCellTime);
          }
        }
      }

      if (this.metronomeEnabled && this.nextCell % beatInterval === 0) {
        this.triggerClick(this.nextCellTime);
      }

      this.onPlayhead?.(this.nextBar, this.nextCell);
      this.state = { ...this.state, currentBar: this.nextBar, currentCell: this.nextCell };

      this.nextCell++;
      if (this.nextCell >= totalCells) {
        this.nextCell = 0;
        this.nextBar = (this.nextBar + 1) % bars.length;
      }
      this.nextCellTime += cellDur;
    }
  }

  private triggerVoice(voiceId: VoiceId, time: number): void {
    switch (voiceId) {
      case 'kick':       this.triggerKick(time);       break;
      case 'snare':      this.triggerSnare(time);      break;
      case 'hh-closed':  this.triggerHH(time, 0.05);  break;
      case 'hh-open':    this.triggerHH(time, 0.2);   break;
      case 'tom-hi':     this.triggerTom(time, 300);   break;
      case 'tom-mid':    this.triggerTom(time, 200);   break;
      case 'tom-floor':  this.triggerTom(time, 130);   break;
      case 'crash':      this.triggerCrash(time);      break;
      case 'ride':       this.triggerRide(time);       break;
    }
  }

  private triggerClick(time: number): void {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 1000;
    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.02);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.02);
  }

  private triggerKick(time: number): void {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(60, time);
    osc.frequency.exponentialRampToValueAtTime(0.001, time + 0.5);
    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.5);
  }

  private triggerSnare(time: number): void {
    const ctx = this.ctx!;
    const bufLen = Math.floor(ctx.sampleRate * 0.2);
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(1, time);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.2);
    noise.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(time);
    noise.stop(time + 0.2);

    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = 200;
    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.5, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.1);
  }

  private triggerHH(time: number, decay: number): void {
    const ctx = this.ctx!;
    const bufLen = Math.floor(ctx.sampleRate * decay);
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
    const source = ctx.createBufferSource();
    source.buffer = buf;
    const bpf = ctx.createBiquadFilter();
    bpf.type = 'bandpass';
    bpf.frequency.value = 8000;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + decay);
    source.connect(bpf);
    bpf.connect(gain);
    gain.connect(ctx.destination);
    source.start(time);
    source.stop(time + decay);
  }

  private triggerTom(time: number, freq: number): void {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.5, time + 0.3);
    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.3);
  }

  private triggerCrash(time: number): void {
    const ctx = this.ctx!;
    const decay = 0.5;
    const bufLen = Math.floor(ctx.sampleRate * decay);
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
    const source = ctx.createBufferSource();
    source.buffer = buf;
    const hpf = ctx.createBiquadFilter();
    hpf.type = 'highpass';
    hpf.frequency.value = 3000;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + decay);
    source.connect(hpf);
    hpf.connect(gain);
    gain.connect(ctx.destination);
    source.start(time);
    source.stop(time + decay);
  }

  private triggerRide(time: number): void {
    const ctx = this.ctx!;
    const decay = 0.15;
    const bufLen = Math.floor(ctx.sampleRate * decay);
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
    const source = ctx.createBufferSource();
    source.buffer = buf;
    const bpf = ctx.createBiquadFilter();
    bpf.type = 'bandpass';
    bpf.frequency.value = 5000;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(1, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + decay);
    source.connect(bpf);
    bpf.connect(gain);
    gain.connect(ctx.destination);
    source.start(time);
    source.stop(time + decay);

    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = 800;
    oscGain.gain.setValueAtTime(0.3, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + decay);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + decay);
  }
}
