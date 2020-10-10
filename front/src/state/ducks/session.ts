import { executeAsyncAction, IAction, IActionWithPayload } from "./common"
import { authenticationAPI, usersAPI } from "../../api"
import jwt_decode from "jwt-decode"

/**
 * STORE USER SESSION INFORMATION
 */

// State
export interface IUser extends usersAPI.IUser {}

interface ISessionState {
	userMetadata: IUser | undefined
}

export const initialSessionState: ISessionState = {
	userMetadata: undefined,
}

// Actions & Actions Type
const GOT_USER_METADATA = "app/session/GOT_USER_METADATA"
export const LOGOUT = "app/session/LOGOUT"

interface IGotUserMetadataAction
	extends IActionWithPayload<typeof GOT_USER_METADATA, IUser> {}

interface ILogoutAction extends IAction<typeof LOGOUT> {}

type SessionActionsTypes = IGotUserMetadataAction | ILogoutAction

// ACTIONS CREATORS
export const actions = {
	gotUserMetadata: (payload: IUser): IGotUserMetadataAction => ({
		type: GOT_USER_METADATA,
		payload,
	}),
	logout: (): ILogoutAction => ({ type: LOGOUT }),
}

// REDUCER
export default function reducer(
	state: ISessionState = initialSessionState,
	action: SessionActionsTypes
) {
	switch (action.type) {
		case GOT_USER_METADATA:
			return { ...state, userMetadata: action.payload }
		case LOGOUT:
			return initialSessionState
		default:
			return state
	}
}

// OPERATIONS
const login = ({
	username,
	password,
}: {
	username: string
	password: string
}) =>
	executeAsyncAction(
		() => authenticationAPI.login(username, password),
		(res) => {
			const userMetadata = jwt_decode(res.access_token) as any
			console.log(userMetadata)
			return actions.gotUserMetadata(userMetadata)
		}
	)

const disconnectUser = () => actions.logout()

export { login, disconnectUser }
