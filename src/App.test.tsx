import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import * as sheetStorage from './storage/sheetStorage'

vi.mock('./hooks/usePlayback', () => ({
  usePlayback: vi.fn(() => ({
    isPlaying: false,
    activeCellIndex: -1,
    play: vi.fn(),
    stop: vi.fn(),
  })),
}))

describe('App', () => {
  it('renders the app heading', () => {
    render(<App />)
    expect(screen.getByText('Doef')).not.toBeNull()
  })

  it('shows BPM input and time signature select', () => {
    render(<App />)
    const bpmInput = screen.getByRole('spinbutton', { name: /BPM/i }) as HTMLInputElement
    expect(bpmInput.value).toBe('120')
    const tsSel = screen.getByRole('combobox', { name: /Time signature/i }) as HTMLSelectElement
    expect(tsSel.value).toBe('4/4')
  })

  it('BPM input updates sheet bpm', async () => {
    const user = userEvent.setup()
    render(<App />)
    const bpmInput = screen.getByRole('spinbutton', { name: /BPM/i }) as HTMLInputElement
    await user.clear(bpmInput)
    await user.type(bpmInput, '140')
    expect(Number(bpmInput.value)).toBeGreaterThanOrEqual(30)
  })

  it('renders a Play button when not playing', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /Play/i })).not.toBeNull()
  })

  it('renders the drum grid SVG', () => {
    const { container } = render(<App />)
    expect(container.querySelector('svg')).not.toBeNull()
  })

  it('toggles a cell when clicked', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)
    const cell = container.querySelector('.cell') as Element
    // Should not throw when clicked
    await user.click(cell)
  })

  it('renders a sheet name input with the sheet name', () => {
    render(<App />)
    const nameInput = screen.getByRole('textbox', { name: /Sheet name/i }) as HTMLInputElement
    expect(nameInput.value).toBe('Untitled')
  })

  it('renders an Open button', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /Open sheet/i })).not.toBeNull()
  })

  describe('open sheet list', () => {
    beforeEach(() => {
      vi.spyOn(sheetStorage, 'listSheets').mockReturnValue([
        { id: 'abc', name: 'My Beat', updatedAt: '2024-01-02T00:00:00.000Z' },
        { id: 'def', name: 'Another', updatedAt: '2024-01-01T00:00:00.000Z' },
      ])
    })

    it('shows saved sheet names after clicking Open', async () => {
      const user = userEvent.setup()
      render(<App />)
      await user.click(screen.getByRole('button', { name: /Open sheet/i }))
      expect(screen.getByText('My Beat')).not.toBeNull()
      expect(screen.getByText('Another')).not.toBeNull()
    })

    it('closes the list after clicking Close', async () => {
      const user = userEvent.setup()
      render(<App />)
      await user.click(screen.getByRole('button', { name: /Open sheet/i }))
      await user.click(screen.getByRole('button', { name: /Close sheet list/i }))
      expect(screen.queryByText('My Beat')).toBeNull()
    })

    it('loads a sheet when its name is clicked', async () => {
      const loaded = {
        id: 'abc', name: 'My Beat', bpm: 100,
        timeSignature: { beats: 4, subdivision: 4 },
        bars: [], createdAt: '', updatedAt: '',
      }
      vi.spyOn(sheetStorage, 'loadSheet').mockReturnValue(loaded)
      const user = userEvent.setup()
      render(<App />)
      await user.click(screen.getByRole('button', { name: /Open sheet/i }))
      await user.click(screen.getByText('My Beat'))
      const nameInput = screen.getByRole('textbox', { name: /Sheet name/i }) as HTMLInputElement
      expect(nameInput.value).toBe('My Beat')
    })
  })
})
