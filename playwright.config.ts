import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  outputDir: './docs/ux-audit/screenshots',
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'on',
    video: 'off',
    headless: true,
    ...devices['Desktop Chrome'],
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 10_000,
  },
})
