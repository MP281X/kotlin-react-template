import { Loader2Icon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '#lib/utils.tsx'

export function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
	const [show, setShow] = useState(false)

	useEffect(() => {
		const timer = setTimeout(() => setShow(true), 50)
		return () => clearTimeout(timer)
	}, [])

	if (!show) return
	return <Loader2Icon role="status" aria-label="Loading" className={cn('size-4 animate-spin', className)} {...props} />
}

