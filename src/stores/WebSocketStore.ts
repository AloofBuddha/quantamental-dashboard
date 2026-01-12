/**
 * WebSocketStore - Manages WebSocket connection to stock data server
 *
 * Features:
 * - Connection lifecycle management
 * - Auto-reconnect with exponential backoff
 * - Message parsing and routing to StockDataStore
 * - Connection status tracking
 */

import { create } from 'zustand'
import { useStockDataStore } from './StockDataStore'
import type { WebSocketMessage } from '@/types/Stock'

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

interface WebSocketState {
	ws: WebSocket | null
	status: ConnectionStatus
	reconnectAttempts: number
	shouldReconnect: boolean

	// Actions
	connect: (url?: string) => void
	disconnect: () => void
}

const DEFAULT_WS_URL = 'ws://localhost:8080'
const BASE_RECONNECT_DELAY = 3000 // 3 seconds
const MAX_RECONNECT_DELAY = 30000 // 30 seconds

export const useWebSocketStore = create<WebSocketState>((set, get) => ({
	ws: null,
	status: 'disconnected',
	reconnectAttempts: 0,
	shouldReconnect: true,

	connect: (url: string = DEFAULT_WS_URL) => {
		const state = get()

		// Don't connect if already connected or connecting
		if (state.status === 'connected' || state.status === 'connecting') {
			return
		}

		set({ status: 'connecting', shouldReconnect: true })

		const ws = new WebSocket(url)

		ws.onopen = () => {
			set({
				ws,
				status: 'connected',
				reconnectAttempts: 0
			})
			console.log('WebSocket connected')
		}

		ws.onmessage = (event: MessageEvent) => {
			try {
				const message: WebSocketMessage = JSON.parse(event.data)

				if (message.type === 'snapshot') {
					useStockDataStore.getState().setStocks(message.stocks)
					console.log(`Received snapshot: ${message.stocks.length} stocks`)
				} else if (message.type === 'update') {
					useStockDataStore.getState().updateStocks(message.deltas)
				}
			} catch (error) {
				console.error('Failed to parse WebSocket message:', error)
			}
		}

		ws.onclose = () => {
			const currentState = get()
			set({ ws: null, status: 'disconnected' })

			// Auto-reconnect if not manually disconnected
			if (currentState.shouldReconnect) {
				const attempts = currentState.reconnectAttempts + 1
				const delay = Math.min(BASE_RECONNECT_DELAY * Math.pow(2, attempts - 1), MAX_RECONNECT_DELAY)

				console.log(`WebSocket closed. Reconnecting in ${delay / 1000}s (attempt ${attempts})...`)

				set({ reconnectAttempts: attempts })

				setTimeout(() => {
					if (get().shouldReconnect) {
						get().connect(url)
					}
				}, delay)
			}
		}

		ws.onerror = () => {
			set({ status: 'error' })
			console.error('WebSocket error')
		}

		set({ ws })
	},

	disconnect: () => {
		const state = get()

		// Mark as intentional disconnect to prevent auto-reconnect
		set({ shouldReconnect: false })

		if (state.ws) {
			state.ws.close()
		}

		set({
			ws: null,
			status: 'disconnected',
			reconnectAttempts: 0
		})
	}
}))

// Reset function for testing
export const resetWebSocketStore = () => {
	const state = useWebSocketStore.getState()
	if (state.ws) {
		state.ws.close()
	}
	useWebSocketStore.setState({
		ws: null,
		status: 'disconnected',
		reconnectAttempts: 0,
		shouldReconnect: true
	})
}

// Convenience hooks
export const useConnectionStatus = () => useWebSocketStore((state) => state.status)
export const useIsConnected = () => useWebSocketStore((state) => state.status === 'connected')
