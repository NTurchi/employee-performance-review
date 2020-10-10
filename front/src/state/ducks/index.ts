import { combineReducers } from "redux"
import { AnyAction } from "redux"
import * as reducers from "./rootReducer"
import { LOGOUT } from "./session"

const extendedRootReducer = (state: any, action: AnyAction) => {
	const rootReducer = combineReducers(reducers)
	if (action.type === LOGOUT) {
		return rootReducer(undefined, action)
	}
	return rootReducer(state, action)
}

export default extendedRootReducer
