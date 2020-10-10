import { useSelector } from "react-redux"
import AppState from "../state"

/**
 * State selector API Fetch Status
 */
const useFetchStatus = () => {
	const isFetching = useSelector(
		({ fetchStatus }: AppState) => fetchStatus.isFetching
	)
	return isFetching
}

export default useFetchStatus
