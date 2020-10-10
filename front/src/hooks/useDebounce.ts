import { useEffect, useState } from 'react'

/**
 * Check if a value hasn't change during X ms and trigger rerender if it is the case
 *
 * @example 
 *  useDebounce("Nicolas", 300) -> 
 * @param value {any} any value
 * @param delay {number} in ms
 */
const useDebounce = (value: any, delay: number) => {
	const [debouncedValue, setDebouncedValue] = useState(value)

	useEffect(() => {
		const timeoutRef = setTimeout(() => {
			setDebouncedValue(value)
		}, delay)
		return () => clearTimeout(timeoutRef)
	})

	return debouncedValue
}

export default useDebounce