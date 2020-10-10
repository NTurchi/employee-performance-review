import { useEffect, useRef, useCallback } from "react"

/**
 * Call a callback if the user clicked outside of a specifc HTML Node (using ref hooks)
 */
const useOutsideClick = (
	onOutsideClick: () => void
): React.MutableRefObject<HTMLElement | null> => {
	const element = useRef<HTMLElement | null>(null)

	const handleOutsideClick = useCallback(
		(ev: MouseEvent) => {
			if (
				element.current &&
				ev.target &&
				!element.current.contains(ev.target as any)
			) {
				onOutsideClick.call(onOutsideClick)
			}
		},
		[onOutsideClick]
	)

	useEffect(() => {
		document.addEventListener("mousedown", handleOutsideClick, false)
		return () =>
			document.removeEventListener("mousedown", handleOutsideClick, false)
	}, [handleOutsideClick])

	return element
}

export default useOutsideClick
