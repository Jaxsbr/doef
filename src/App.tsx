import { useEffect, useMemo, useRef, useState } from 'react'
import { StaffNotation } from './components/StaffNotation'
import { useSheet } from './hooks/useSheet'
import { usePlayback } from './hooks/usePlayback'
import { useAutoSave } from './hooks/useAutoSave'
import { createSheet } from './model/factory'
import { listSheets, loadSheet, exportSheet, importSheet } from './storage/sheetStorage'
import type { TimeSignature } from './model/types'
import type { SheetMeta } from './storage/sheetStorage'

const TIME_SIGNATURES: { label: string; ts: TimeSignature }[] = [
  { label: '4/4', ts: { beats: 4, subdivision: 4 } },
  { label: '3/4', ts: { beats: 3, subdivision: 4 } },
  { label: '6/8', ts: { beats: 6, subdivision: 8 } },
  { label: '7/8', ts: { beats: 7, subdivision: 8 } },
  { label: '5/4', ts: { beats: 5, subdivision: 4 } },
]

const DEFAULT_SHEET = createSheet('Untitled', { beats: 4, subdivision: 4 }, 120, 4)

function loadInitialSheet() {
  const sheets = listSheets()
  if (sheets.length > 0) {
    const latest = sheets.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0]
    const loaded = loadSheet(latest.id)
    if (loaded) return loaded
  }
  return DEFAULT_SHEET
}

function App() {
  const initialSheet = useMemo(() => loadInitialSheet(), [])
  const { sheet, setSheet, toggleCell, toggleSticking, clearSheet, setBpm, setTimeSignature, setBarCount, setName, canUndo, canRedo, undo, redo } = useSheet(initialSheet)
  const { isPlaying, activeCellIndex, metronomeOn, play, stop, toggleMetronome } = usePlayback()
  useAutoSave(sheet)

  const [showOpen, setShowOpen] = useState(false)
  const [savedSheets, setSavedSheets] = useState<SheetMeta[]>([])
  const importInputRef = useRef<HTMLInputElement>(null)
  const [flashMsg, setFlashMsg] = useState<string | null>(null)
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function showFlash(msg: string) {
    if (flashTimer.current) clearTimeout(flashTimer.current)
    setFlashMsg(msg)
    flashTimer.current = setTimeout(() => setFlashMsg(null), 2000)
  }

  function handlePlayStop() {
    if (isPlaying) {
      stop()
    } else {
      play(sheet)
    }
  }

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (isPlaying) stop(); else play(sheet);
      } else if (e.key === 'z' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (
        (e.key === 'z' && (e.ctrlKey || e.metaKey) && e.shiftKey) ||
        (e.key === 'y' && (e.ctrlKey || e.metaKey))
      ) {
        e.preventDefault();
        redo();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isPlaying, play, stop, sheet, undo, redo]);

  function handleExport() {
    const json = exportSheet(sheet)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${sheet.name.replace(/\s+/g, '-').toLowerCase()}.doef`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const imported = importSheet(reader.result as string)
        setSheet(imported)
        showFlash('Sheet imported')
      } catch {
        // ignore malformed files
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function handleOpenList() {
    setSavedSheets(listSheets().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)))
    setShowOpen(true)
  }

  function handleSelectSheet(id: string) {
    const loaded = loadSheet(id)
    if (loaded) setSheet(loaded)
    setShowOpen(false)
  }

  return (
    <div className="app">
      <header>
        <h1>Doef</h1>
        <input
          type="text"
          value={sheet.name}
          onChange={(e) => setName(e.target.value)}
          aria-label="Sheet name"
          className="sheet-name"
        />
        <div className="controls">
          <div className="control-group">
            <label>
              BPM
              <input
                type="number"
                min={30}
                max={300}
                value={sheet.bpm}
                onChange={(e) => {
                  const v = Math.max(30, Math.min(300, Number(e.target.value)))
                  setBpm(v)
                }}
                aria-label="BPM"
              />
            </label>
            <label>
              Bars
              <input
                type="number"
                min={1}
                max={16}
                value={sheet.bars.length}
                onChange={(e) => setBarCount(Number(e.target.value))}
                aria-label="Bar count"
              />
            </label>
            <label>
              Time
              <select
                value={`${sheet.timeSignature.beats}/${sheet.timeSignature.subdivision}`}
                onChange={(e) => {
                  const found = TIME_SIGNATURES.find((t) => t.label === e.target.value)
                  if (found) setTimeSignature(found.ts)
                }}
                aria-label="Time signature"
              >
                {TIME_SIGNATURES.map((t) => (
                  <option key={t.label} value={t.label}>{t.label}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="control-group">
            <button onClick={undo} disabled={!canUndo} aria-label="Undo">Undo</button>
            <button onClick={redo} disabled={!canRedo} aria-label="Redo">Redo</button>
            <button
              onClick={() => { if (window.confirm('Clear all beats? This cannot be undone.')) clearSheet(); }}
              aria-label="Clear sheet"
            >Clear</button>
          </div>
          <div className="control-group">
            <button onClick={handleExport} aria-label="Export sheet">Export</button>
            <button onClick={() => importInputRef.current?.click()} aria-label="Import sheet">Import</button>
            <input
              ref={importInputRef}
              type="file"
              accept=".doef,application/json"
              style={{ display: 'none' }}
              onChange={handleImportFile}
              aria-label="Import sheet file"
            />
            <div className="open-sheet-wrapper">
              <button onClick={handleOpenList} aria-label="Open sheet">Open</button>
              {showOpen && (
                <div className="sheet-dropdown" aria-label="Saved sheets">
                  <button onClick={() => setShowOpen(false)} aria-label="Close sheet list" className="sheet-dropdown-close">✕</button>
                  <ul>
                    {savedSheets.map((s) => (
                      <li key={s.id}>
                        <button onClick={() => handleSelectSheet(s.id)}>{s.name}</button>
                      </li>
                    ))}
                    {savedSheets.length === 0 && (
                      <li className="sheet-dropdown-empty">No saved sheets</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <div className="control-group">
            <button onClick={handlePlayStop} aria-label={isPlaying ? 'Stop' : 'Play'}>
              {isPlaying ? '⏹ Stop' : '▶ Play'}
            </button>
            <button onClick={toggleMetronome} aria-label={metronomeOn ? 'Metronome on' : 'Metronome off'}>
              {metronomeOn ? 'Metro: On' : 'Metro: Off'}
            </button>
          </div>
        </div>
      </header>
      {flashMsg && (
        <div className="flash-msg" role="status" aria-live="polite">{flashMsg}</div>
      )}
      <div className="hint-bar" aria-label="Keyboard shortcuts">
        Click cell to place hit · Right-click cell for R/L sticking · <kbd>Space</kbd> play/stop · <kbd>Ctrl Z</kbd> undo · <kbd>Ctrl Shift Z</kbd> redo
      </div>
      <main>
        <StaffNotation
          sheet={sheet}
          activeCellIndex={activeCellIndex}
          onCellClick={toggleCell}
          onStickingClick={toggleSticking}
        />
      </main>
    </div>
  )
}

export default App
