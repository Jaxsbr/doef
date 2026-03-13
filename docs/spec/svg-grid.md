# SVG Grid Specification

## Layout

```
[Voice Labels] [Bar 1 Grid] [Bar 2 Grid] [Bar 3 Grid] [Bar 4 Grid]
               [Bar 5 Grid] [Bar 6 Grid] [Bar 7 Grid] [Bar 8 Grid]
```

- Bars arranged left-to-right, wrapping after `barsPerLine` (default 4).
- Voice labels repeat on each line.

## Dimensions (design tokens)

```typescript
const GRID = {
  cellWidth: 24,        // px per subdivision cell
  cellHeight: 24,       // px per voice row
  labelWidth: 40,       // px for voice label column
  barGap: 16,           // px between bars horizontally
  lineGap: 24,          // px between wrapped lines
  barNumberHeight: 16,  // px above bar for bar number
  barsPerLine: 4,       // bars before wrapping
  padding: 16,          // px outer padding
};
```

## SVG Structure (per bar)

```svg
<g class="bar" transform="translate(x, y)">
  <!-- Bar number -->
  <text class="bar-number">1</text>

  <!-- Beat grouping lines (every 4 cells in 4/4) -->
  <line class="beat-line" ... />

  <!-- Voice rows -->
  <g class="voice-row" transform="translate(0, rowY)">
    <!-- Voice label (only on first bar of line) -->
    <text class="voice-label">SD</text>

    <!-- Cells -->
    <g class="cell" data-voice="snare" data-cell="0">
      <rect class="cell-bg" />        <!-- hover/select target -->
      <circle class="cell-hit" />      <!-- visible when hit=true -->
    </g>
  </g>
</g>
```

## Hit Indicator

- **Rest (false)**: empty cell, light grey background on hover.
- **Hit (true)**: filled black circle, centred in cell.
- **Playhead active**: cell background highlighted (e.g. light blue), reverts to normal when playhead moves on.

## Beat Grouping Lines

Thicker vertical lines at quarter-note boundaries to aid readability.
- In 4/4: line every 4 cells (4 groups of 4 sixteenths).
- In 6/8: line every 2 cells (6 groups of 2 sixteenths, since each 8th = 2 cells at 16th resolution).

## Print Considerations

- All interactive colours (hover, playhead) hidden in print.
- Hit circles: solid black.
- Grid lines: light grey (#ccc).
- Beat lines: darker grey (#666).
- Labels: black.
- Background: white (no fills).
