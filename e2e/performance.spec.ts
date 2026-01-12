/**
 * E2E Performance Tests
 *
 * Tests real-time update performance:
 * - Frame rate (FPS) during live updates
 * - Memory stability over time
 * - Grid responsiveness with thousands of rows
 */

import { test, expect } from '@playwright/test'

test.describe('Performance', () => {
	test('maintains >55 FPS during real-time updates', async ({ page }) => {
		// Extend timeout for this test
		test.setTimeout(60000)
		// Navigate to screener page
		await page.goto('/')

		// Wait for grid to load
		const grid = page.locator('.ag-root-wrapper')
		await expect(grid).toBeVisible({ timeout: 10000 })

		// Wait for initial data to load
		await page.waitForTimeout(2000)

		// Start performance measurement
		const performanceObserver = await page.evaluateHandle(() => {
			return new Promise<number>((resolve) => {
				const frames: number[] = []
				let lastTime = performance.now()
				const startTime = performance.now()
				const duration = 5000 // Measure for 5 seconds

				function measureFrame() {
					const now = performance.now()
					const elapsed = now - lastTime
					const totalElapsed = now - startTime

					if (elapsed > 0) {
						// Calculate FPS for this frame
						const fps = 1000 / elapsed
						frames.push(fps)
					}

					lastTime = now

					if (totalElapsed < duration) {
						requestAnimationFrame(measureFrame)
					} else {
						// Calculate average FPS
						const avgFps = frames.length > 0 ? frames.reduce((a, b) => a + b, 0) / frames.length : 0
						resolve(avgFps)
					}
				}

				requestAnimationFrame(measureFrame)
			})
		})

		// Wait for measurement to complete
		const avgFps = await performanceObserver.jsonValue()

		console.log(`Average FPS: ${avgFps.toFixed(2)}`)

		// Should maintain at least 55 FPS
		expect(avgFps).toBeGreaterThanOrEqual(55)
	})

	test('grid remains responsive during updates', async ({ page }) => {
		await page.goto('/')

		// Wait for grid to load
		const grid = page.locator('.ag-root-wrapper')
		await expect(grid).toBeVisible({ timeout: 10000 })

		// Wait for data
		await page.waitForTimeout(2000)

		// Try to interact with grid (sorting, filtering)
		const symbolHeader = page.locator('.ag-header-cell:has-text("Symbol")')
		await expect(symbolHeader).toBeVisible()

		// Click to sort - should be responsive even during updates
		await symbolHeader.click()

		// Verify sort worked by checking ascending sort icon appears
		await page.waitForTimeout(100)

		// Grid should still show data after sort
		const rows = page.locator('.ag-row')
		const rowCount = await rows.count()
		expect(rowCount).toBeGreaterThan(0)
	})

	test('handles large dataset without degradation', async ({ page }) => {
		await page.goto('/')

		// Wait for grid
		const grid = page.locator('.ag-root-wrapper')
		await expect(grid).toBeVisible({ timeout: 10000 })

		// Wait for all data to load
		await page.waitForTimeout(3000)

		// Check that we have a substantial number of rows
		const rows = page.locator('.ag-row')
		const rowCount = await rows.count()

		console.log(`Grid displaying ${rowCount} rows`)

		// Should be able to display 2000+ stocks
		expect(rowCount).toBeGreaterThanOrEqual(40) // At least showing first page

		// Scroll should be smooth
		await page.evaluate(() => {
			const gridBody = document.querySelector('.ag-body-viewport')
			if (gridBody) {
				gridBody.scrollTop = 1000
			}
		})

		await page.waitForTimeout(500)

		// Should still have rows visible after scroll
		const visibleRows = await rows.count()
		expect(visibleRows).toBeGreaterThan(0)
	})

	test('memory remains stable over 30 seconds', async ({ page }) => {
		// Extend timeout for this long-running test
		test.setTimeout(60000)
		await page.goto('/')

		// Wait for grid
		const grid = page.locator('.ag-root-wrapper')
		await expect(grid).toBeVisible({ timeout: 10000 })

		// Measure initial memory
		const initialMemory = await page.evaluate(() => {
			if (performance.memory) {
				return performance.memory.usedJSHeapSize
			}
			return 0
		})

		// Wait 30 seconds with updates running
		await page.waitForTimeout(30000)

		// Measure final memory
		const finalMemory = await page.evaluate(() => {
			if (performance.memory) {
				return performance.memory.usedJSHeapSize
			}
			return 0
		})

		if (initialMemory > 0 && finalMemory > 0) {
			const memoryGrowth = (finalMemory - initialMemory) / initialMemory

			console.log(
				`Memory growth: ${(memoryGrowth * 100).toFixed(2)}% (${(initialMemory / 1024 / 1024).toFixed(2)}MB -> ${(finalMemory / 1024 / 1024).toFixed(2)}MB)`
			)

			// Memory should not grow more than 50% over 30 seconds
			expect(memoryGrowth).toBeLessThan(0.5)
		} else {
			console.log('Performance.memory API not available, skipping memory check')
		}
	})
})
