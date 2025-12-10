import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), TanStackRouterVite(), svgr()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src')
		}
	},
	optimizeDeps: {
		exclude: ['fsevents']
	},
	ssr: {
		noExternal: ['fsevents'] // for server-side rendering
	}
})
