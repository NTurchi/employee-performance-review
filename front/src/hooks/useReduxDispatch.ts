import { useDispatch } from "react-redux"
import { ThunkDispatch } from "redux-thunk"
//import { AppState } from "../redux/index"
import { AnyAction } from "redux"

export type ReduxDispatch = ThunkDispatch<any, any, AnyAction>
export default function useReduxDispatch(): ReduxDispatch {
	return useDispatch<ReduxDispatch>()
}
