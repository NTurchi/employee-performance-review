import { useEffect } from "react"

import useDebounce from "./useDebounce"

/**
 * Useful Hooks for making auto complete search input. It will execute the {action} if the {queryParameter} do not have change within {delay} ms
 * This is necessary to avoid too many API requests.
 * @param queryParameter Filter value (in our case employee name)
 * @param action REDUX (Or any other type of action)
 * @param delay delay in MS
 * @param neglectValue Validator callback for the query parameter.
 */
const useLiveSearch = (
	queryParameter: string,
	action: (queryParameter: string) => void,
	delay: number = 350,
	neglectValue = ""
) => {
	const debouncedQuery = useDebounce(queryParameter, delay)

	useEffect(() => {
		if (neglectValue !== debouncedQuery) {
			action(debouncedQuery)
		}
	}, [debouncedQuery, neglectValue, action])
}

export default useLiveSearch
