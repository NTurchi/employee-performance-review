import { Dispatch, Action, AnyAction } from "redux"
import { actions as errorActions } from "./error"
import { actions as fetchStatusActions } from "./fetchStatus"
import { ThunkAction } from "redux-thunk"

/**
 * Common interface to define redux acions type
 */
export interface IAction<T> {
	type: T
}

/**
 * Common interface to define redux acions type
 */
export interface IActionWithPayload<T, P> extends IAction<T> {
	payload: P
}

/**
 * For paginated data
 */
export interface ICursorPagination {
	prev: string | undefined
	next: string | undefined
}

/**
 * Simple generic async operation creator including fetch duck and error duck
 *
 * @param asyncAction
 * @param succeedAction
 */
export const executeAsyncAction = <T>(
	asyncAction: (
		dispatch: Dispatch<AnyAction>,
		getState: () => any
	) => Promise<T>,
	succeedAction?: (result: T) => Action<any>
): ThunkAction<Promise<T>, any, null, AnyAction> => (
	dispatch: Dispatch<AnyAction>,
	getState
) => {
	dispatch(fetchStatusActions.fetch())
	return new Promise((resolve) => {
		asyncAction(dispatch, getState).then(
			(res) => {
				dispatch(fetchStatusActions.fetchFinished())
				if (succeedAction) {
					dispatch((succeedAction as (result: T) => Action<any>)(res))
				}
				resolve(res)
			},
			(err) => {
				dispatch(fetchStatusActions.fetchFinished())
				dispatch(errorActions.addError(err))
			}
		)
	})
}
