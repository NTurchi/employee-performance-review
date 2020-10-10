import { useCallback, useEffect } from "react"

const useUniqueEffect = (callback: () => void) => {
	const cb = useCallback(callback, [])
	useEffect(cb, [])
}

export default useUniqueEffect
