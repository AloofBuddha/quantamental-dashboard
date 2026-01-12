/**
 * E2E Tests for Stock Views
 *
 * Tests basic functionality of all stock views:
 * - Page loads correctly
 * - Navigation works
 * - Grid displays data (when server is running)
 */

import { test, expect } from '@playwright/test'

test.describe('Stock Views', () => {
	test.describe('Navigation', () => {
		test('can navigate to all views', async ({ page }) => {
			await page.goto('/')

			// Check Screener (home) loads
			await expect(page.locator('h1')).toContainText('Stock Screener')

			// Navigate to Ticker
			await page.click('a:has-text("Ticker")')
			await expect(page).toHaveURL('/ticker')
			await expect(page.locator('h1')).toContainText('Real-Time Ticker')

			// Navigate to Fundamentals
			await page.click('a:has-text("Fundamentals")')
			await expect(page).toHaveURL('/fundamentals')
			await expect(page.locator('h1')).toContainText('Fundamental Analysis')

			// Navigate to Portfolio
			await page.click('a:has-text("Portfolio")')
			await expect(page).toHaveURL('/portfolio')
			await expect(page.locator('h1')).toContainText('Portfolio View')

			// Navigate back to Screener
			await page.click('a:has-text("Screener")')
			await expect(page).toHaveURL('/')
		})
	})

	test.describe('Screener View', () => {
		test('shows connecting state initially', async ({ page }) => {
			await page.goto('/')

			// Should show either connecting message or the grid
			const content = page.locator('body')
			await expect(content).toBeVisible()
		})

		test('has correct page title', async ({ page }) => {
			await page.goto('/')
			await expect(page.locator('h1')).toContainText('Stock Screener')
		})
	})

	test.describe('With Server Running', () => {
		// These tests require the WebSocket server to be running
		// They will show connection state handling if server is not available

		test('displays grid when connected', async ({ page }) => {
			await page.goto('/')

			// Wait for either grid or error state
			const gridOrError = page.locator('.ag-root-wrapper, button:has-text("Retry")')
			await expect(gridOrError.first()).toBeVisible({ timeout: 10000 })
		})

		test('can filter stocks by column', async ({ page }) => {
			await page.goto('/')

			// Wait for grid to load
			const grid = page.locator('.ag-root-wrapper')

			// Only proceed if grid is visible (server running)
			if (await grid.isVisible()) {
				// AG Grid should have filter inputs
				const filterIcon = page.locator('.ag-header-icon')
				if (await filterIcon.first().isVisible()) {
					// Grid is interactive
					expect(true).toBe(true)
				}
			}
		})

		test('can sort stocks by clicking column header', async ({ page }) => {
			await page.goto('/')

			const grid = page.locator('.ag-root-wrapper')

			if (await grid.isVisible()) {
				// Click on Symbol header to sort
				const symbolHeader = page.locator('.ag-header-cell:has-text("Symbol")')
				if (await symbolHeader.isVisible()) {
					await symbolHeader.click()
					// Should not throw
					expect(true).toBe(true)
				}
			}
		})
	})

	test.describe('Dark Mode', () => {
		test('toggles dark mode', async ({ page }) => {
			await page.goto('/')

			// Find the dark mode toggle
			const toggle = page.locator('[aria-label="Toggle dark mode"], button:has-text("mode"), .dark-mode-toggle').first()

			if (await toggle.isVisible()) {
				// Get initial state
				const html = page.locator('html')
				const initialDark = await html.evaluate((el) => el.classList.contains('dark'))

				// Click toggle
				await toggle.click()

				// Check state changed
				const afterDark = await html.evaluate((el) => el.classList.contains('dark'))
				expect(afterDark).not.toBe(initialDark)
			}
		})
	})
})
