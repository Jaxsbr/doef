import { test, expect } from '@playwright/test'
import path from 'path'

const SHOT = (name: string) =>
  path.join('docs/ux-audit', `${name}.png`)

// Helper: click the first hit-zone for a given voice + cell index (first bar only).
// force:true bypasses SVG hit-zone overlap between adjacent voices (e.g. crash over hh-closed).
async function clickCell(page: import('@playwright/test').Page, voice: string, cell: number) {
  await page.locator(`g.cell[data-voice="${voice}"][data-cell="${cell}"]`).first().click({ force: true })
}

async function rightClickCell(page: import('@playwright/test').Page, voice: string, cell: number) {
  await page.locator(`g.cell[data-voice="${voice}"][data-cell="${cell}"]`).first().click({ button: 'right', force: true })
}

// ── Flow 1: Create a beat ─────────────────────────────────────────────────────

test('flow: create a beat', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('svg[aria-label]')).toBeVisible()

  await page.screenshot({ path: SHOT('01-create-beat-empty') })

  // Place hits across snare and hi-hat on beat 1 and 3
  await clickCell(page, 'snare', 0)
  await clickCell(page, 'snare', 8)
  await clickCell(page, 'hh-closed', 0)
  await clickCell(page, 'hh-closed', 4)
  await clickCell(page, 'hh-closed', 8)
  await clickCell(page, 'hh-closed', 12)
  await clickCell(page, 'kick', 0)
  await clickCell(page, 'kick', 8)

  await page.screenshot({ path: SHOT('02-create-beat-filled') })
})

// ── Flow 2: Play back ─────────────────────────────────────────────────────────

test('flow: play back', async ({ page }) => {
  await page.goto('/')

  // Place a hit so the sheet is not empty
  await clickCell(page, 'snare', 0)

  await page.screenshot({ path: SHOT('03-playback-before') })

  await page.getByRole('button', { name: 'Play' }).click()
  await expect(page.getByRole('button', { name: 'Stop' })).toBeVisible()

  await page.screenshot({ path: SHOT('04-playback-playing') })

  // Toggle metronome
  await page.getByRole('button', { name: /Metro/ }).click()
  await page.screenshot({ path: SHOT('05-playback-metro-on') })

  await page.getByRole('button', { name: 'Stop' }).click()
  await expect(page.getByRole('button', { name: 'Play' })).toBeVisible()

  await page.screenshot({ path: SHOT('06-playback-stopped') })
})

// ── Flow 3: Sticking ──────────────────────────────────────────────────────────

test('flow: sticking', async ({ page }) => {
  await page.goto('/')

  // Place a snare hit first
  await clickCell(page, 'snare', 0)
  await page.screenshot({ path: SHOT('07-sticking-hit-placed') })

  // Right-click to set R
  await rightClickCell(page, 'snare', 0)
  await page.screenshot({ path: SHOT('08-sticking-R') })

  // Right-click again to set L
  await rightClickCell(page, 'snare', 0)
  await page.screenshot({ path: SHOT('09-sticking-L') })

  // Right-click again to clear
  await rightClickCell(page, 'snare', 0)
  await page.screenshot({ path: SHOT('10-sticking-cleared') })
})

// ── Flow 4: Undo / redo ───────────────────────────────────────────────────────

test('flow: undo and redo', async ({ page }) => {
  await page.goto('/')

  await clickCell(page, 'snare', 0)
  await clickCell(page, 'snare', 4)
  await page.screenshot({ path: SHOT('11-undo-two-hits') })

  await page.getByRole('button', { name: 'Undo' }).click()
  await page.screenshot({ path: SHOT('12-undo-one-hit') })

  await page.getByRole('button', { name: 'Undo' }).click()
  await page.screenshot({ path: SHOT('13-undo-empty') })

  await page.getByRole('button', { name: 'Redo' }).click()
  await page.screenshot({ path: SHOT('14-redo-one-hit') })
})

// ── Flow 5: Export ────────────────────────────────────────────────────────────

test('flow: export', async ({ page }) => {
  await page.goto('/')

  await clickCell(page, 'snare', 0)
  await page.screenshot({ path: SHOT('15-export-before') })

  // Intercept the download so the test doesn't stall
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Export sheet' }).click(),
  ])
  expect(download.suggestedFilename()).toMatch(/\.doef$/)

  await page.screenshot({ path: SHOT('16-export-after') })
})

// ── Flow 6: Open saved sheet ──────────────────────────────────────────────────

test('flow: open saved sheet', async ({ page }) => {
  // Seed a sheet into localStorage before load
  // Storage format: doef:sheets = string[] of IDs; doef:sheet:<id> = Sheet JSON
  await page.goto('/')
  await page.evaluate(() => {
    const voices = ['hh-closed','hh-open','ride','crash','tom-hi','tom-mid','snare','tom-floor','kick']
    const emptyBar = {
      voiceCells: Object.fromEntries(voices.map((v) => [v, Array(16).fill(false)])),
    }
    const sheet = {
      id: 'test-sheet-1',
      name: 'Test Groove',
      timeSignature: { beats: 4, subdivision: 4 },
      bpm: 120,
      bars: [emptyBar, emptyBar, emptyBar, emptyBar],
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem(`doef:sheet:${sheet.id}`, JSON.stringify(sheet))
    localStorage.setItem('doef:sheets', JSON.stringify([sheet.id]))
  })
  await page.reload()
  await page.waitForLoadState('networkidle')

  await page.screenshot({ path: SHOT('17-open-sheet-list-closed') })

  await page.locator('button[aria-label="Open sheet"]').click()
  await page.screenshot({ path: SHOT('18-open-sheet-list-open') })

  await page.getByRole('button', { name: 'Test Groove' }).click()
  await page.screenshot({ path: SHOT('19-open-sheet-loaded') })
})
