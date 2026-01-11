/**
 * WebSocket Server for Quantamental Trading Dashboard
 *
 * Features:
 * - Broadcasts initial snapshot of 1K-5K stocks on connection
 * - Supports real-time delta updates (Phase 3)
 * - Handles multiple client connections
 * - Heartbeat/ping-pong for connection health
 */

import { WebSocketServer, WebSocket, RawData } from 'ws'
import { generateStocks, type GeneratedStock } from './dataGenerator'
import type { SnapshotMessage } from '@/types/Stock'

// Extended WebSocket with heartbeat tracking
interface ExtendedWebSocket extends WebSocket {
	isAlive: boolean
}

// Configuration
const PORT = 8080
const STOCK_COUNT = 2000
const HEARTBEAT_INTERVAL = 30000 // 30 seconds

// Generate stock data once at startup
console.log(`\nGenerating ${STOCK_COUNT} stocks...`)
const stocks: GeneratedStock[] = generateStocks(STOCK_COUNT)
console.log(`Stock data ready!\n`)

// Create WebSocket server
const wss = new WebSocketServer({ port: PORT })

console.log(`WebSocket server running on ws://localhost:${PORT}`)
console.log(`Broadcasting ${stocks.length} stocks to clients`)
console.log(`Server ready! Waiting for connections...\n`)

// Track active connections
let connectionCount = 0

// Handle new client connections
wss.on('connection', (ws: ExtendedWebSocket) => {
	connectionCount++
	const clientId = connectionCount

	console.log(`Client #${clientId} connected (Total clients: ${wss.clients.size})`)

	// Send initial snapshot immediately
	const snapshot: SnapshotMessage = {
		type: 'snapshot',
		timestamp: Date.now(),
		stocks: stocks
	}

	try {
		ws.send(JSON.stringify(snapshot))
		console.log(`Sent snapshot to Client #${clientId} (${stocks.length} stocks)`)
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Unknown error'
		console.error(`Error sending snapshot to Client #${clientId}:`, message)
	}

	// Set up heartbeat
	ws.isAlive = true
	ws.on('pong', () => {
		ws.isAlive = true
	})

	// Handle client messages (for future two-way communication)
	ws.on('message', (data: RawData) => {
		try {
			const message = JSON.parse(data.toString())
			console.log(`Message from Client #${clientId}:`, message)

			// Handle different message types (future enhancement)
			if (message.type === 'ping') {
				ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }))
			}
		} catch (error) {
			const msg = error instanceof Error ? error.message : 'Unknown error'
			console.error(`Error parsing message from Client #${clientId}:`, msg)
		}
	})

	// Handle client disconnect
	ws.on('close', () => {
		console.log(`Client #${clientId} disconnected (Total clients: ${wss.clients.size})`)
	})

	// Handle errors
	ws.on('error', (error: Error) => {
		console.error(`WebSocket error for Client #${clientId}:`, error.message)
	})
})

// Heartbeat interval: Ping all clients to detect dead connections
const heartbeatInterval = setInterval(() => {
	wss.clients.forEach((ws) => {
		const extWs = ws as ExtendedWebSocket
		if (extWs.isAlive === false) {
			console.log('Terminating dead connection')
			return extWs.terminate()
		}

		extWs.isAlive = false
		extWs.ping()
	})
}, HEARTBEAT_INTERVAL)

// Cleanup on server shutdown
wss.on('close', () => {
	clearInterval(heartbeatInterval)
	console.log('\nWebSocket server shutting down...')
})

// Handle process termination
function gracefulShutdown(signal: string): void {
	console.log(`\n\nReceived ${signal}, shutting down gracefully...`)

	wss.clients.forEach((ws) => {
		ws.close()
	})

	wss.close(() => {
		console.log('WebSocket server closed')
		process.exit(0)
	})
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'))
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))

// Export for testing (Phase 1 complete with snapshot only)
// Phase 3 will add real-time delta updates
export { wss, stocks }
