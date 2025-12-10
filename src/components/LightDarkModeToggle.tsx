import { SystemTheme, useCurrentTheme, useSetCurrentTheme, useSetDarkMode } from '@/stores/DarkModeStore'
import { ComputerDesktopIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline'

export default function LightDarkModeToggle() {
	const currentTheme = useCurrentTheme()

	const handleOnClickSystem = () => {
		useSetCurrentTheme(SystemTheme.SYSTEM)
		useSetDarkMode(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
	}

	const handleOnClickDark = () => {
		useSetCurrentTheme(SystemTheme.DARK)
		useSetDarkMode(true)
	}

	const handleOnClickLight = () => {
		useSetCurrentTheme(SystemTheme.LIGHT)
		useSetDarkMode(false)
	}
	return (
		<div className={`flex items-center space-x-3 border border-slate-300 dark:border-slate-600 px-3 py-2 rounded-[20px] `}>
			<SunIcon className={`h-5  ${currentTheme == SystemTheme.LIGHT ? 'text-blue-500' : ' text-gray-500 dark:text-gray-400'}`} onClick={() => handleOnClickLight()} />
			<MoonIcon className={`h-5   ${currentTheme == SystemTheme.DARK ? 'text-blue-500' : ' text-gray-500 dark:text-gray-400'}`} onClick={() => handleOnClickDark()} />
			<ComputerDesktopIcon className={`h-5  ${currentTheme == SystemTheme.SYSTEM ? 'text-blue-500' : ' text-gray-500  dark:text-gray-400'}`} onClick={() => handleOnClickSystem()} />
		</div>
	)
}
