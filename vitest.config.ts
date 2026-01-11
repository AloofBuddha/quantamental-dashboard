import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		environment: 'jsdom',
		setupFiles: './src/__tests__/setup.ts',
		// Use node environment for server tests (no DOM needed)
		environmentMatchGlobs: [['src/server/**/*.test.ts', 'node']],
		// Include both .ts and .tsx test files
		include: ['src/**/*.test.{ts,tsx}']
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src')
		}
	}
})
