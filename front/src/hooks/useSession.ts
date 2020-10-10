import { useSelector } from "react-redux"
import AppState from "../state"

/**
 * State selector Session
 */
const useSession = () => {
	const isFetching = useSelector(({ session }: AppState) => session)
	return isFetching
}

export default useSession
