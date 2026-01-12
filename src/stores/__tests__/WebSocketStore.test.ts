/**
 * Tests for WebSocketStore
 *
 * Tests the WebSocket connection management:
 * - Connection lifecycle (connect, disconnect)
 * - Status tracking
 * - Message handling
 * - Auto-reconnect logic
 *
 * Note: These are integration tests that mock the WebSocket API
 */

import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { useWebSocketStore, resetWebSocketStore } from '../WebSocketStore'
import { useStockDataStore, resetStockDataStore } from '../StockDataStore'
import type { SnapshotMessage } from '@/types/Stock'

// Mock WebSocket
class MockWebSocket {
	static instances: MockWebSocket[] = []
	readyState: number = WebSocket.CONNECTING
	onopen: (() => void) | null = null
	onclose: (() => void) | null = null
	onmessage: ((event: { data: string }) => void) | null = null
	onerror: ((error: Event) => void) | null = null

	constructor(public url: string) {
		MockWebSocket.instances.push(this)
	}

	close() {
		this.readyState = WebSocket.CLOSED
		this.onclose?.()
	}

	send(_data: string) {
		// Mock send
	}

	// Test helpers
	simulateOpen() {
		this.readyState = WebSocket.OPEN
		this.onopen?.()
	}

	simulateMessage(data: unknown) {
		this.onmessage?.({ data: JSON.stringify(data) })
	}

	simulateClose() {
		this.readyState = WebSocket.CLOSED
		this.onclose?.()
	}

	simulateError() {
		this.onerror?.(new Event('error'))
	}
}

// Replace global WebSocket with mock
const originalWebSocket = global.WebSocket
beforeEach(() => {
	MockWebSocket.instances = []
	// @ts-expect-error - Replacing global WebSocket with mock
	global.WebSocket = MockWebSocket
})

afterEach(() => {
	global.WebSocket = originalWebSocket
})

describe('WebSocketStore', () => {
	beforeEach(() => {
		vi.useFakeTimers()
		resetWebSocketStore()
		resetStockDataStore()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	describe('Initial State', () => {
		it('starts with disconnected status', () => {
			const state = useWebSocketStore.getState()
			expect(state.status).toBe('disconnected')
		})

		it('starts with no WebSocket instance', () => {
			const state = useWebSocketStore.getState()
			expect(state.ws).toBeNull()
		})
	})

	describe('connect()', () => {
		it('creates WebSocket connection to correct URL', () => {
			useWebSocketStore.getState().connect()

			expect(MockWebSocket.instances.length).toBe(1)
			expect(MockWebSocket.instances[0].url).toBe('ws://localhost:8080')
		})

		it('sets status to connecting', () => {
			useWebSocketStore.getState().connect()

			const state = useWebSocketStore.getState()
			expect(state.status).toBe('connecting')
		})

		it('sets status to connected when WebSocket opens', () => {
			useWebSocketStore.getState().connect()
			MockWebSocket.instances[0].simulateOpen()

			const state = useWebSocketStore.getState()
			expect(state.status).toBe('connected')
		})

		it('does not create new connection if already connected', () => {
			useWebSocketStore.getState().connect()
			MockWebSocket.instances[0].simulateOpen()

			// Try to connect again
			useWebSocketStore.getState().connect()

			expect(MockWebSocket.instances.length).toBe(1)
		})
	})

	describe('disconnect()', () => {
		it('closes WebSocket connection', () => {
			useWebSocketStore.getState().connect()
			MockWebSocket.instances[0].simulateOpen()

			useWebSocketStore.getState().disconnect()

			expect(MockWebSocket.instances[0].readyState).toBe(WebSocket.CLOSED)
		})

		it('sets status to disconnected', () => {
			useWebSocketStore.getState().connect()
			MockWebSocket.instances[0].simulateOpen()
			useWebSocketStore.getState().disconnect()

			const state = useWebSocketStore.getState()
			expect(state.status).toBe('disconnected')
		})
	})

	describe('Message Handling', () => {
		it('processes snapshot message and updates StockDataStore', () => {
			const mockSnapshot: SnapshotMessage = {
				type: 'snapshot',
				timestamp: Date.now(),
				stocks: [
					{
						symbol: 'AAPL',
						name: 'Apple Inc',
						sector: 'Technology',
						growthScore: 75,
						valueScore: 60,
						qualityScore: 80,
						momentumScore: 65,
						price: 175,
						changePercent: 1.5,
						volume: 1000000,
						marketCap: 3000000000000,
						pe: 28,
						pb: 45,
						ps: 7,
						evEbitda: 22,
						roe: 0.15,
						roa: 0.2,
						debtToEquity: 1.5,
						currentRatio: 1.0,
						quickRatio: 0.9,
						grossMargin: 0.43,
						operatingMargin: 0.3,
						netMargin: 0.25,
						ebitdaMargin: 0.33,
						revenueGrowth: 0.08,
						earningsGrowth: 0.1,
						epsGrowth: 0.12,
						dividendYield: 0.005,
						beta: 1.2
					}
				]
			}

			useWebSocketStore.getState().connect()
			MockWebSocket.instances[0].simulateOpen()
			MockWebSocket.instances[0].simulateMessage(mockSnapshot)

			const stockState = useStockDataStore.getState()
			expect(stockState.stocks.size).toBe(1)
			expect(stockState.stocks.get('AAPL')?.price).toBe(175)
		})
	})

	describe('Auto-Reconnect', () => {
		it('attempts to reconnect after unexpected disconnect', () => {
			useWebSocketStore.getState().connect()
			MockWebSocket.instances[0].simulateOpen()

			// Simulate unexpected close
			MockWebSocket.instances[0].simulateClose()

			// Should attempt reconnect after delay
			vi.advanceTimersByTime(3000)

			expect(MockWebSocket.instances.length).toBe(2)
		})

		it('does not reconnect if manually disconnected', () => {
			useWebSocketStore.getState().connect()
			MockWebSocket.instances[0].simulateOpen()

			// Manual disconnect
			useWebSocketStore.getState().disconnect()

			// Advance timers
			vi.advanceTimersByTime(5000)

			// Should not have created new connection
			expect(MockWebSocket.instances.length).toBe(1)
		})

		it('uses exponential backoff for reconnect attempts', () => {
			useWebSocketStore.getState().connect()
			MockWebSocket.instances[0].simulateOpen()

			// First disconnect
			MockWebSocket.instances[0].simulateClose()
			vi.advanceTimersByTime(1000)
			expect(MockWebSocket.instances.length).toBe(1) // Not yet

			vi.advanceTimersByTime(2000) // Total 3s (first retry at 3s)
			expect(MockWebSocket.instances.length).toBe(2)

			// Second disconnect
			MockWebSocket.instances[1].simulateClose()
			vi.advanceTimersByTime(3000) // Not yet (second retry at 6s)
			expect(MockWebSocket.instances.length).toBe(2)

			vi.advanceTimersByTime(3000) // Total 6s from second close
			expect(MockWebSocket.instances.length).toBe(3)
		})
	})

	describe('Error Handling', () => {
		it('sets status to error on WebSocket error', () => {
			useWebSocketStore.getState().connect()
			MockWebSocket.instances[0].simulateError()

			const state = useWebSocketStore.getState()
			expect(state.status).toBe('error')
		})
	})
})
