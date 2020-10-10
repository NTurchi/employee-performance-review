import { IActionWithPayload } from "./common"

/**
 * ERROR SYSTEM. It is a simple app so it is not necessary to do something sophisticate
 */

export enum ErrorType {
	SERVER_DOWN = "server-down",
	SERVER_ERROR = "server-error",
	UNAUTHORIZED = "unauthorized",
	MOT_FOUND = "not-found",
	CLIENT_ERROR = "client-error",
}

// State
export interface IError {
	message: string
	type: ErrorType
}

// STATE TYPE
type ErrorState = IError[]

/**
 * Error array index
 */
type ErrorIndex = number

// Actions & Actions Type
const ADD_ERROR = "app/error/ADD_ERROR"
const REMOVE_ERROR = "app/error/REMOVE_ERROR"

interface IAddErrorAction
	extends IActionWithPayload<typeof ADD_ERROR, IError> {}
interface IRemoveErrorAction
	extends IActionWithPayload<typeof REMOVE_ERROR, ErrorIndex> {}

type ErrorActionTypes = IAddErrorAction | IRemoveErrorAction

// Reducer
export default function reducer(
	state: ErrorState = [],
	action: ErrorActionTypes
) {
	switch (action.type) {
		case REMOVE_ERROR:
			return [...state.filter((v, i) => i !== action.payload)]
		case ADD_ERROR:
			return [...state, action.payload]
		default:
			return state
	}
}

// Action Creators
export const actions = {
	addError: (payload: IError): IAddErrorAction => ({
		type: ADD_ERROR,
		payload,
	}),
	removeError: (payload: ErrorIndex): IRemoveErrorAction => ({
		type: REMOVE_ERROR,
		payload,
	}),
}
