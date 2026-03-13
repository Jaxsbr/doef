# Audio Engine Specification

## Architecture

```
usePlayback hook
  └── PlaybackEngine (class)
        ├── AudioContext (lazy singleton)
        ├── VoiceSynth (per-voice sound generator)
        └── Scheduler (look-ahead scheduling loop)
```

## AudioContext Lifecycle

1. **Not created** until first user gesture (play button click).
2. Created once, reused across play/stop cycles.
3. On `play`: resume context if suspended.
4. On `stop`: do NOT close context — just stop scheduling.

## Scheduling Strategy

Use the **look-ahead scheduler** pattern (Chris Wilson's "A Tale of Two Clocks"):

1. A `setInterval` loop runs every ~25ms.
2. Each tick, schedule all notes within the next ~100ms window using `AudioContext.currentTime`.
3. This ensures sample-accurate timing despite JS timer jitter.

```
scheduleAheadTime = 0.1  // seconds to look ahead
timerInterval = 25        // ms between scheduler ticks
```

## Playback State

```typescript
interface PlaybackState {
  isPlaying: boolean;
  currentBar: number;      // 0-indexed
  currentCell: number;     // 0-indexed within bar
  startTime: number;       // AudioContext time when playback started
}
```

## Voice Synthesis (Web Audio API)

All sounds synthesised — no samples.

| Voice | Technique |
|-------|-----------|
| Kick | Low-frequency oscillator (sine ~60Hz) with pitch envelope down + gain envelope |
| Snare | Noise burst (white noise via buffer) + tone (triangle ~200Hz), both with fast decay |
| HH Closed | Bandpass-filtered noise, very short decay (~50ms) |
| HH Open | Bandpass-filtered noise, longer decay (~200ms) |
| Toms | Sine oscillator at voice-specific pitch (hi=300Hz, mid=200Hz, floor=130Hz) with pitch+gain envelope |
| Crash | Noise burst through highpass filter, long decay (~500ms) |
| Ride | Noise burst through bandpass ~5kHz, medium decay (~150ms), add sine component |

## Playhead Sync

The scheduler tracks `currentCell` and emits updates via callback. The UI subscribes and highlights the active column. Use `requestAnimationFrame` for smooth visual updates, not the scheduler tick.

## Stop Behaviour

1. Cancel scheduler interval.
2. Reset `currentBar` and `currentCell` to 0.
3. Let any currently-playing sounds decay naturally (don't abruptly cut).
