import type { Sheet, VoiceId, Sticking } from '../model/types';
import { VOICES } from '../model/voices';
import { cellsPerBar } from '../model/factory';
import { countInLabels } from '../model/countIn';

// px per half-step on the staff (0 = middle line, ±1 = adjacent space, ±2 = next line, …)
const HALF_STEP = 6;
// px per subdivision cell (horizontal)
const CELL_W = 24;
// px padding above/below the extreme staff positions (±7)
const STAFF_PAD = 8;
// half-steps from centre to extreme edge (kick ledger -6, crash ledger +6, +1 margin)
const Y_EXTENT = 7;
// y of middle line (staffLine 0) within the staff area
const Y_MID = STAFF_PAD + Y_EXTENT * HALF_STEP; // 8 + 42 = 50
// total height of the staff drawing area (bar number excluded)
const STAFF_AREA_H = STAFF_PAD * 2 + Y_EXTENT * 2 * HALF_STEP; // 16 + 84 = 100

const STAFF_LINE_SL = [-4, -2, 0, 2, 4] as const; // staffLine positions for the 5 lines

const LABEL_W = 50;
const BAR_NUM_H = 16;
const COUNT_IN_H = 14; // height reserved for count-in syllable labels
const BARS_PER_LINE = 2;
const BAR_GAP = 16;
const LINE_GAP = 32;
const PADDING = 16;

const NH_RX = 7; // notehead ellipse x-radius
const NH_RY = 5; // notehead ellipse y-radius
const X_R = 6;   // half-size of × notehead arms

/** Convert a staffLine integer to a y-pixel position within the staff area. */
function yOf(staffLine: number): number {
  return Y_MID - staffLine * HALF_STEP;
}

interface StaffNotationProps {
  sheet: Sheet;
  /** Global active cell index (across all bars), or -1 for none. */
  activeCellIndex?: number;
  onCellClick?: (barIndex: number, voice: VoiceId, cellIndex: number) => void;
  /** Right-click (context menu) on a cell — cycles sticking R → L → null. */
  onStickingClick?: (barIndex: number, voice: VoiceId, cellIndex: number) => void;
}

export function StaffNotation({ sheet, activeCellIndex = -1, onCellClick, onStickingClick }: StaffNotationProps) {
  const { timeSignature, bars } = sheet;
  const cellCount = cellsPerBar(timeSignature);
  const hasAnyHit = bars.some((bar) =>
    VOICES.some((v) => bar.voiceCells[v.id]?.some(Boolean))
  );
  const beatInterval = 16 / timeSignature.subdivision; // cells per beat
  const labels = countInLabels(timeSignature);

  const barWidth = cellCount * CELL_W;
  const barH = BAR_NUM_H + COUNT_IN_H + STAFF_AREA_H;
  const barsThisLine = Math.min(bars.length, BARS_PER_LINE);
  const lineWidth =
    PADDING + LABEL_W + barsThisLine * (barWidth + BAR_GAP) - BAR_GAP + PADDING;
  const lineCount = Math.ceil(bars.length / BARS_PER_LINE);
  const totalHeight =
    PADDING + lineCount * barH + (lineCount - 1) * LINE_GAP + PADDING;

  const staffTop = yOf(4);   // y of line 5 (top)
  const staffBot = yOf(-4);  // y of line 1 (bottom)

  return (
    <svg
      width={lineWidth}
      height={totalHeight}
      role="img"
      aria-label={`Staff notation for ${sheet.name}`}
    >
      {bars.map((bar, barIndex) => {
        const lineIndex = Math.floor(barIndex / BARS_PER_LINE);
        const posInLine = barIndex % BARS_PER_LINE;
        const isFirstInLine = posInLine === 0;
        const barCellBase = barIndex * cellCount;

        const bx = PADDING + LABEL_W + posInLine * (barWidth + BAR_GAP);
        const by = PADDING + lineIndex * (barH + LINE_GAP);

        return (
          <g key={barIndex} className="bar" transform={`translate(${bx}, ${by})`}>
            {/* Bar number */}
            <text x={0} y={BAR_NUM_H - 4} fontSize={10} fill="#666" className="bar-number">
              {barIndex + 1}
            </text>

            {/* Count-in syllable labels */}
            {labels.map((label, cellIndex) => (
              <text
                key={cellIndex}
                x={cellIndex * CELL_W + CELL_W / 2}
                y={BAR_NUM_H + COUNT_IN_H - 3}
                fontSize={8}
                fill="#888"
                textAnchor="middle"
                className="count-in-label"
              >
                {label}
              </text>
            ))}

            {/* Staff group */}
            <g transform={`translate(0, ${BAR_NUM_H + COUNT_IN_H})`}>
              {/* Voice abbreviation labels on first bar of each line */}
              {isFirstInLine && VOICES.map((voice) => (
                <text
                  key={voice.id}
                  x={-LABEL_W + 4}
                  y={yOf(voice.staffLine)}
                  fontSize={9}
                  fill="#555"
                  dominantBaseline="middle"
                  className="voice-label"
                >
                  {voice.abbr}
                </text>
              ))}

              {/* 5 staff lines */}
              {STAFF_LINE_SL.map((sl) => (
                <line
                  key={sl}
                  className="staff-line"
                  x1={0}
                  y1={yOf(sl)}
                  x2={barWidth}
                  y2={yOf(sl)}
                  stroke="#000"
                  strokeWidth={0.8}
                />
              ))}

              {/* Opening bar line */}
              <line x1={0} y1={staffTop} x2={0} y2={staffBot} stroke="#000" strokeWidth={1} />

              {/* Closing bar line */}
              <line x1={barWidth} y1={staffTop} x2={barWidth} y2={staffBot} stroke="#000" strokeWidth={1} />

              {/* Beat subdivision lines */}
              {Array.from({ length: Math.floor(cellCount / beatInterval) - 1 }, (_, i) => {
                const lx = (i + 1) * beatInterval * CELL_W;
                return (
                  <line
                    key={i}
                    className="beat-line"
                    x1={lx}
                    y1={staffTop}
                    x2={lx}
                    y2={staffBot}
                    stroke="#999"
                    strokeWidth={0.8}
                  />
                );
              })}

              {/* Active column highlight */}
              {Array.from({ length: cellCount }, (_, cellIndex) => {
                const globalIdx = barCellBase + cellIndex;
                if (globalIdx !== activeCellIndex) return null;
                return (
                  <rect
                    key={cellIndex}
                    x={cellIndex * CELL_W}
                    y={yOf(6)}
                    width={CELL_W}
                    height={yOf(-6) - yOf(6)}
                    fill="#dbeafe"
                    opacity={0.6}
                  />
                );
              })}

              {/* Noteheads per voice */}
              {VOICES.map((voice) => {
                const cells = bar.voiceCells[voice.id];
                const cy = yOf(voice.staffLine);
                const needsLedger =
                  Math.abs(voice.staffLine) >= 6 && voice.staffLine % 2 === 0;
                const stickingRow: Sticking[] = bar.voiceSticking?.[voice.id] ?? [];

                return cells.map((hit, cellIndex) => {
                  const cx = cellIndex * CELL_W + CELL_W / 2;
                  const sticking = stickingRow[cellIndex] ?? null;
                  return (
                    <g
                      key={`${voice.id}-${cellIndex}`}
                      className="cell"
                      data-voice={voice.id}
                      data-cell={cellIndex}
                      onClick={() => onCellClick?.(barIndex, voice.id, cellIndex)}
                      onContextMenu={(e) => { e.preventDefault(); onStickingClick?.(barIndex, voice.id, cellIndex); }}
                      style={{ cursor: onCellClick ? 'pointer' : undefined }}
                    >
                      {/* Per-voice hit-zone centred on this voice's staff position */}
                      <rect
                        x={cellIndex * CELL_W}
                        y={cy - HALF_STEP}
                        width={CELL_W}
                        height={HALF_STEP * 2}
                        fill="transparent"
                      />
                      {hit && (
                        <>
                          {/* Ledger line for notes beyond the staff */}
                          {needsLedger && (
                            <line
                              x1={cx - NH_RX - 2}
                              y1={cy}
                              x2={cx + NH_RX + 2}
                              y2={cy}
                              stroke="#000"
                              strokeWidth={0.8}
                            />
                          )}
                          {/* Notehead */}
                          {voice.noteheadType === 'filled' ? (
                            <ellipse
                              cx={cx}
                              cy={cy}
                              rx={NH_RX}
                              ry={NH_RY}
                              fill="#000"
                              className="notehead-filled"
                            />
                          ) : (
                            <g className="notehead-x">
                              <line
                                x1={cx - X_R} y1={cy - X_R}
                                x2={cx + X_R} y2={cy + X_R}
                                stroke="#000" strokeWidth={1.8}
                                strokeLinecap="round"
                              />
                              <line
                                x1={cx - X_R} y1={cy + X_R}
                                x2={cx + X_R} y2={cy - X_R}
                                stroke="#000" strokeWidth={1.8}
                                strokeLinecap="round"
                              />
                            </g>
                          )}
                        </>
                      )}
                      {/* Sticking label (R/L) above the notehead */}
                      {sticking !== null && (
                        <text
                          x={cx}
                          y={cy - NH_RY - 3}
                          fontSize={10}
                          fontWeight="bold"
                          textAnchor="middle"
                          dominantBaseline="auto"
                          fill="#1d4ed8"
                          className="sticking-label"
                        >
                          {sticking}
                        </text>
                      )}
                    </g>
                  );
                });
              })}
            </g>
          </g>
        );
      })}
      {/* Empty-state onboarding prompt */}
      {!hasAnyHit && (
        <text
          x={lineWidth / 2}
          y={totalHeight - PADDING / 2}
          fontSize={11}
          fill="#aaa"
          textAnchor="middle"
          dominantBaseline="auto"
          className="empty-state-hint"
        >
          Click any cell to place a hit · right-click to set sticking
        </text>
      )}
    </svg>
  );
}
