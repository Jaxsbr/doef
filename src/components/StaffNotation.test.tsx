import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StaffNotation } from './StaffNotation';
import { createSheet } from '../model/factory';

const sheet4_4 = createSheet('Test', { beats: 4, subdivision: 4 }, 120, 2);

describe('StaffNotation render', () => {
  it('renders an SVG element', () => {
    const { container } = render(<StaffNotation sheet={sheet4_4} />);
    expect(container.querySelector('svg')).not.toBeNull();
  });

  it('renders the correct number of bar groups', () => {
    const { container } = render(<StaffNotation sheet={sheet4_4} />);
    expect(container.querySelectorAll('.bar')).toHaveLength(2);
  });

  it('renders bar numbers 1 and 2', () => {
    const { container } = render(<StaffNotation sheet={sheet4_4} />);
    const labels = Array.from(container.querySelectorAll('.bar-number')).map(
      (el) => el.textContent,
    );
    expect(labels).toContain('1');
    expect(labels).toContain('2');
  });

  it('renders 5 staff lines per bar (10 total for 2 bars)', () => {
    const { container } = render(<StaffNotation sheet={sheet4_4} />);
    expect(container.querySelectorAll('.staff-line')).toHaveLength(10);
  });

  it('has voice abbreviation labels on the first bar', () => {
    const { container } = render(<StaffNotation sheet={sheet4_4} />);
    const labels = Array.from(container.querySelectorAll('.voice-label')).map(
      (el) => el.textContent,
    );
    expect(labels).toContain('SD'); // snare
    expect(labels).toContain('HH'); // hi-hat closed
    expect(labels).toContain('KK'); // kick
  });

  it('accessible label contains sheet name', () => {
    render(<StaffNotation sheet={sheet4_4} />);
    expect(screen.getByRole('img', { name: /Test/ })).not.toBeNull();
  });

  it('renders 16 cell groups per voice in 4/4 (9 voices × 16 cells × 2 bars)', () => {
    const { container } = render(<StaffNotation sheet={sheet4_4} />);
    // 9 voices × 16 cells × 2 bars = 288 cell elements
    expect(container.querySelectorAll('.cell')).toHaveLength(9 * 16 * 2);
  });

  it('renders no noteheads when all cells are false', () => {
    const { container } = render(<StaffNotation sheet={sheet4_4} />);
    expect(container.querySelectorAll('.notehead-filled')).toHaveLength(0);
    expect(container.querySelectorAll('.notehead-x')).toHaveLength(0);
  });

  it('renders a filled notehead for a kick hit', () => {
    const sheet = createSheet('Hit', { beats: 4, subdivision: 4 }, 120, 1);
    sheet.bars[0].voiceCells['kick'][0] = true;
    const { container } = render(<StaffNotation sheet={sheet} />);
    expect(container.querySelectorAll('.notehead-filled')).toHaveLength(1);
    expect(container.querySelectorAll('.notehead-x')).toHaveLength(0);
  });

  it('renders an × notehead for a hi-hat hit', () => {
    const sheet = createSheet('Hit', { beats: 4, subdivision: 4 }, 120, 1);
    sheet.bars[0].voiceCells['hh-closed'][0] = true;
    const { container } = render(<StaffNotation sheet={sheet} />);
    expect(container.querySelectorAll('.notehead-x')).toHaveLength(1);
    expect(container.querySelectorAll('.notehead-filled')).toHaveLength(0);
  });

  it('renders filled noteheads for all drum hits and × for all cymbal hits', () => {
    const sheet = createSheet('Mixed', { beats: 4, subdivision: 4 }, 120, 1);
    sheet.bars[0].voiceCells['snare'][0] = true;
    sheet.bars[0].voiceCells['kick'][2] = true;
    sheet.bars[0].voiceCells['crash'][0] = true;
    sheet.bars[0].voiceCells['ride'][4] = true;
    const { container } = render(<StaffNotation sheet={sheet} />);
    expect(container.querySelectorAll('.notehead-filled')).toHaveLength(2);
    expect(container.querySelectorAll('.notehead-x')).toHaveLength(2);
  });

  it('does not render a notehead for a rest cell', () => {
    const sheet = createSheet('Rest', { beats: 4, subdivision: 4 }, 120, 1);
    // all cells default to false — ensure none rendered
    const { container } = render(<StaffNotation sheet={sheet} />);
    expect(container.querySelectorAll('ellipse.notehead-filled')).toHaveLength(0);
  });
});

describe('StaffNotation count-in labels', () => {
  it('renders 16 count-in labels per bar for 4/4 (32 total for 2 bars)', () => {
    const { container } = render(<StaffNotation sheet={sheet4_4} />);
    expect(container.querySelectorAll('.count-in-label')).toHaveLength(32);
  });

  it('renders beat downbeat labels "1","2","3","4" in the first bar', () => {
    const { container } = render(<StaffNotation sheet={sheet4_4} />);
    const labels = Array.from(container.querySelectorAll('.count-in-label')).map(
      (el) => el.textContent,
    );
    // First bar: cells 0–15
    expect(labels[0]).toBe('1');
    expect(labels[4]).toBe('2');
    expect(labels[8]).toBe('3');
    expect(labels[12]).toBe('4');
  });

  it('renders 16th-note subdivision syllables in the first beat', () => {
    const { container } = render(<StaffNotation sheet={sheet4_4} />);
    const labels = Array.from(container.querySelectorAll('.count-in-label')).map(
      (el) => el.textContent,
    );
    expect(labels[1]).toBe('e');
    expect(labels[2]).toBe('and');
    expect(labels[3]).toBe('a');
  });

  it('renders correct count-in labels for a 6/8 sheet (12 labels per bar)', () => {
    const sheet = createSheet('Test 6/8', { beats: 6, subdivision: 8 }, 120, 1);
    const { container } = render(<StaffNotation sheet={sheet} />);
    const labels = Array.from(container.querySelectorAll('.count-in-label')).map(
      (el) => el.textContent,
    );
    expect(labels).toHaveLength(12);
    expect(labels[0]).toBe('1');
    expect(labels[1]).toBe('and');
    expect(labels[2]).toBe('2');
    expect(labels[10]).toBe('6');
    expect(labels[11]).toBe('and');
  });
});

describe('StaffNotation interaction', () => {
  it('calls onCellClick with correct barIndex and cellIndex when a cell is clicked', async () => {
    const user = userEvent.setup();
    const handler = vi.fn();
    const { container } = render(<StaffNotation sheet={sheet4_4} onCellClick={handler} />);
    const firstCell = container.querySelector('.cell') as Element;
    await user.click(firstCell);
    expect(handler).toHaveBeenCalledWith(0, expect.any(String), 0);
  });

  it('does not throw when onCellClick is not provided', async () => {
    const user = userEvent.setup();
    const { container } = render(<StaffNotation sheet={sheet4_4} />);
    const firstCell = container.querySelector('.cell') as Element;
    await expect(user.click(firstCell)).resolves.not.toThrow();
  });
});
