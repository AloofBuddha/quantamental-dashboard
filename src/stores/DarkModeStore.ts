import { useLocalStorage } from '@/utils/useLocalStorage'
import { useEffect } from 'react'
import { create } from 'zustand'

export enum SystemTheme {
	DARK = 'dark',
	LIGHT = 'light',
	SYSTEM = 'system'
}

type State = {
	isDarkMode: boolean
	currentTheme: SystemTheme
}

interface Actions {
	actions: {
		toggleDarkMode: () => void
		setDarkMode: (darkMode: boolean) => void
		setCurrentTheme: (mode: SystemTheme) => void
	}
}

const getInitalDarkMode = () => {
	// Also sets document class for dark mode on initial load
	const { getNestedValue } = useLocalStorage('globalSettings')
	let initalDarkMode = getNestedValue(['isDarkMode']) == undefined ? window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches : getNestedValue(['isDarkMode'])
	initalDarkMode ? document.documentElement.classList.add('dark') : document.documentElement.classList.remove('dark')
	return initalDarkMode
}

const useDarkModeStore = create<State & Actions>((set) => {
	const { getNestedValue, setNestedValue } = useLocalStorage('globalSettings')
	return {
		isDarkMode: getInitalDarkMode(),
		currentTheme: getNestedValue(['currentTheme']) || SystemTheme.DARK,
		actions: {
			toggleDarkMode: () => {
				set((state) => {
					setNestedValue(['isDarkMode'], !state.isDarkMode)

					if (!state.isDarkMode) {
						document.documentElement.classList.add('dark')
					} else {
						document.documentElement.classList.remove('dark')
					}

					return {
						isDarkMode: !state.isDarkMode
					}
				})
			},
			setDarkMode: (darkMode) => {
				setNestedValue(['isDarkMode'], darkMode)

				if (darkMode) {
					document.documentElement.classList.add('dark')
				} else {
					document.documentElement.classList.remove('dark')
				}

				set(() => ({
					isDarkMode: darkMode
				}))
			},
			setCurrentTheme: (theme) => {
				setNestedValue(['currentTheme'], theme)
				set(() => ({
					currentTheme: theme
				}))
			}
		}
	}
})

// MARK: State
export const useIsDarkMode = () => useDarkModeStore((state) => state.isDarkMode)
export const useIsDarkModeOutsideComponent = () => useDarkModeStore.getState().isDarkMode
export const useCurrentTheme = () => useDarkModeStore((state) => state.currentTheme)

// MARK: Actions
export const useToggleDarkMode = () => useDarkModeStore.getState().actions.toggleDarkMode()
export const useSetDarkMode = (darkMode: boolean) => useDarkModeStore.getState().actions.setDarkMode(darkMode)
export const useSetCurrentTheme = (theme: SystemTheme) => useDarkModeStore.getState().actions.setCurrentTheme(theme)

// Listens for system theme changes and updates the store accordingly
export const useDarkMode: any = () => {
	const isDarkMode = useIsDarkMode()
	const currentTheme = useCurrentTheme()
	// Listen for system theme changes
	useEffect(() => {
		if (typeof window === 'undefined') return
		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

		const handleChange = (e: MediaQueryListEvent) => {
			if (currentTheme == 'system') {
				useSetDarkMode(e.matches)
			}
		}

		mediaQuery.addEventListener('change', handleChange)

		return () => mediaQuery.removeEventListener('change', handleChange)
	}, [currentTheme])

	// Add keyboard shortcut (Ctrl+0)
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.ctrlKey && event.key === '0') {
				if (isDarkMode) {
					useSetCurrentTheme(SystemTheme.LIGHT)
				} else {
					useSetCurrentTheme(SystemTheme.DARK)
				}
				useToggleDarkMode() // Toggle dark mode
			}
		}

		window.addEventListener('keydown', handleKeyDown)
		return () => window.removeEventListener('keydown', handleKeyDown)
	}, [isDarkMode])
}
