export const localStorageHelper = (key: string) => {
	// MARK: Single Value methods
	const setItem = (value: unknown) => {
		if (typeof window !== 'undefined') {
			window.localStorage.setItem(key, JSON.stringify(value))
		}
	}

	const getItem = () => {
		if (typeof window !== 'undefined') {
			const item = window.localStorage.getItem(key)
			return item ? JSON.parse(item) : null
		}
		return null
	}

	const removeItem = () => {
		if (typeof window !== 'undefined') {
			window.localStorage.removeItem(key)
		}
	}

	// MARK: Dictionary methods
	// use 'user.address.city' key string to get/set/remove nested dictionary values
	const getDictionaryItem = (dictionaryKey: string) => {
		if (window == undefined) {
			console.error('getDictionary: window is not defined', window)
			return null
		}
		const item = getItem()
		return item ? item[dictionaryKey] : null
	}

	const setDictionaryItem = (dictionaryKey: string, value: unknown) => {
		if (window == undefined) {
			console.error('setDictionary: window is not defined', window)
			return
		}
		const prev = getItem()
		if (prev == undefined) {
			window.localStorage.setItem(key, JSON.stringify({ [dictionaryKey]: value }))
		} else {
			const newValue = { ...prev, [dictionaryKey]: value }
			window.localStorage.setItem(key, JSON.stringify(newValue))
		}
	}

	const removeDictionaryItem = (dictionaryKey: string) => {
		setDictionaryItem(dictionaryKey, null)
	}

	const getNestedValue = (dictionaryKeys: string[]) => {
		if (window == undefined) {
			console.error('getNestedValue: window is not defined', window)
			return null
		}
		const item = getItem()
		if (!item) {
			return null
		}

		let result = item
		for (const key of dictionaryKeys) {
			if (result[key] !== undefined) {
				result = result[key]
			} else {
				return null
			}
		}
		return result
	}

	const setNestedValue = (dictionaryKeys: string[], value: unknown) => {
		if (window == undefined) {
			console.error('setNestedValue: window is not defined', window)
			return
		}

		let prev = getItem()
		if (prev == undefined) {
			// If there is no previous value, initialize it as an empty object
			prev = {}
		}
		let current = prev // Start with the previous value
		// Traverse the keys to find the last key in the nested structure
		for (let i = 0; i < dictionaryKeys.length - 1; i++) {
			const key = dictionaryKeys[i]
			// If the key doesn't exist, create an empty object for it
			if (current[key] === undefined) {
				current[key] = {}
			}
			// Move to the next level in the nested structure
			current = current[key]
		}
		// Set the	 value for the last key in the nested structure
		const lastKey = dictionaryKeys[dictionaryKeys.length - 1]
		// Set the value for the last key

		current[lastKey] = value
		window.localStorage.setItem(key, JSON.stringify(prev))
		// Update the local storage with the modified object
		// This will ensure that the entire structure is saved back to local storage
	}

	const removeNestedValue = (dictionaryKeys: string[]) => {
		if (window == undefined) {
			console.error('setNestedValue: window is not defined', window)
			return
		}

		const prev = getItem()
		if (prev == undefined) {
			// If there is no previous value, initialize it as an empty object
			return
		}
		let current = prev
		for (let i = 0; i < dictionaryKeys.length - 1; i++) {
			const key = dictionaryKeys[i]
			// If the key doesn't exist, create an empty object for it
			if (current[key] === undefined) {
				return
			}
			// Move to the next level in the nested structure
			current = current[key]
		}
		// Set the value for the last key in the nested structure
		delete current[dictionaryKeys[dictionaryKeys.length - 1]] // Delete the last key from the current object
		window.localStorage.setItem(key, JSON.stringify(prev))
	}

	return { setItem, getItem, removeItem, setDictionaryItem, getDictionaryItem, removeDictionaryItem, getNestedValue, setNestedValue, removeNestedValue }
}

export function exportLocalStorageToFile(filename: string = 'localStorage.json'): void {
	const data: Record<string, string> = {}

	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i)
		if (key !== null) {
			const value = localStorage.getItem(key)
			if (value !== null) {
				data[key] = value
			}
		}
	}

	const fileContent = JSON.stringify(data, null, 2)
	const blob = new Blob([fileContent], { type: 'application/json' })
	const url = URL.createObjectURL(blob)

	const a = document.createElement('a')
	a.href = url
	a.download = filename
	document.body.appendChild(a)
	a.click()
	document.body.removeChild(a)

	URL.revokeObjectURL(url)
}

export function importLocalStorageFromText(jsonText: string): void {
	try {
		// Parse the JSON text to an object
		const data = JSON.parse(jsonText)

		// Verify that the parsed data is an object
		if (typeof data === 'object' && data !== null) {
			// Iterate over each key/value pair and store it in localStorage
			for (const key in data) {
				if (Object.prototype.hasOwnProperty.call(data, key)) {
					localStorage.setItem(key, data[key])
				}
			}
			console.log('Local storage imported successfully.')
			window.location.reload()
		} else {
			console.error('Imported data is not a valid object.')
		}
	} catch (error) {
		console.error('Failed to import local storage:', error)
	}
}

function importLocalStorageFromFile(file: File): void {
	const reader = new FileReader()

	reader.onload = (event) => {
		const text = event.target?.result
		if (typeof text === 'string') {
			importLocalStorageFromText(text)
		} else {
			console.error('File content is not a valid string.')
		}
	}

	reader.onerror = (error) => {
		console.error('Error reading file:', error)
	}

	reader.readAsText(file)
}

export function pickFileAndImportLocalStorage(): void {
	// Create an invisible file input element
	const input = document.createElement('input')
	input.type = 'file'
	input.accept = 'text/plain,application/json' // Accept plain text or JSON files

	// Listen for the file selection
	input.onchange = (event: Event) => {
		const target = event.target as HTMLInputElement
		if (target.files && target.files.length > 0) {
			const file = target.files[0]
			importLocalStorageFromFile(file)
		}
	}

	// Programmatically trigger the file picker dialog
	input.click()
}
