import { cn } from '@/utils/cn'

interface LoadingSpinnerProps {
	size?: 'sm' | 'md' | 'lg'
	message?: string
	fullScreen?: boolean
}

export default function LoadingSpinner({ size = 'md', message, fullScreen = true }: LoadingSpinnerProps) {
	const sizeClasses = {
		sm: 'w-8 h-8 border-2',
		md: 'w-12 h-12 border-3',
		lg: 'w-16 h-16 border-4'
	}

	const spinner = (
		<div className="flex flex-col items-center justify-center gap-3">
			<div
				className={cn(
					'rounded-full border-slate-300 dark:border-slate-600 border-t-blue-600 dark:border-t-blue-400 animate-spin',
					sizeClasses[size]
				)}
			/>
			{message && (
				<p className="text-sm text-slate-600 dark:text-slate-400 animate-pulse">
					{message}
				</p>
			)}
		</div>
	)

	if (fullScreen) {
		return (
			<div className="absolute inset-0 flex items-center justify-center bg-slate-50 dark:bg-slate-950 z-10">
				{spinner}
			</div>
		)
	}

	return spinner
}

