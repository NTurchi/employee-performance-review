import { IAction } from "./common"
import { combineReducers } from "redux"

/**
 * SIMPLE DUCKS TO CHECK WETHER OR NOT THE APP IS FETCHING SOME DATA FROM THE API
 */

// State
interface IFetchState {
	isFetching: boolean
}

export const initialFetchState: IFetchState = {
	isFetching: false,
}

// Actions & Actions Type
const FETCH = "app/fetch-status/FETCH"
const FETCH_FINISHED = "app/fetch-status/FETCH_FINISHED"

interface IFetchAction extends IAction<typeof FETCH> {}
interface IFetchFinishedAction extends IAction<typeof FETCH_FINISHED> {}

// Looks boilerplate but actually it helps for checking action type. Reduce the number of mistake for large project
type FetchApiActionsTypes = IFetchAction | IFetchFinishedAction

// Reducer
function reducer(state: boolean = false, action: FetchApiActionsTypes) {
	switch (action.type) {
		case FETCH:
			return true
		case FETCH_FINISHED:
			return false
		default:
			return state
	}
}

export default combineReducers<IFetchState>({
	isFetching: reducer,
})

// Action Creators
export const actions = {
	fetch: (): IFetchAction => ({ type: FETCH }),
	fetchFinished: (): IFetchFinishedAction => ({ type: FETCH_FINISHED }),
}
