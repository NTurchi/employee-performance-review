import { usersAPI, userReviewsAPI } from "../../api"
import { executeAsyncAction, IAction, IActionWithPayload } from "./common"

/**
 * Review feature
 */

// State

export interface IUser extends usersAPI.IUser {}

/**
 *  USER STATE
 */
type UserState = IUser[]

// Actions & Actions Type
const GOT_USERS = "app/users/GOT_USERS"
const DELETED_USER = "app/users/DELETE_USER"
const CREATED_USER = "app/users/CREATED_USER"
const UPDATED_USER = "app/users/UPDATED_USER"
const RESET_USERS = "app/users/RESET_USERS"

// ACTIONS TYPES
interface IGotUsersAction
	extends IActionWithPayload<typeof GOT_USERS, UserState> {}

interface ICreatedUsersAction
	extends IActionWithPayload<typeof CREATED_USER, IUser> {}

interface IDeletedUsersAction
	extends IActionWithPayload<typeof DELETED_USER, number> {} // id as payload

interface IUpdatedUsersAction
	extends IActionWithPayload<typeof UPDATED_USER, IUser> {}

interface IResetUsersAction extends IAction<typeof RESET_USERS> {}

type UsersAction =
	| IGotUsersAction
	| ICreatedUsersAction
	| IDeletedUsersAction
	| IUpdatedUsersAction
	| IResetUsersAction

// ACTIONS CREATOR
export const actions = {
	gotUsers: (payload: UserState): IGotUsersAction => ({
		type: GOT_USERS,
		payload,
	}),
	createUser: (payload: IUser): ICreatedUsersAction => ({
		type: CREATED_USER,
		payload,
	}),
	deleteUser: (payload: number): IDeletedUsersAction => ({
		type: DELETED_USER,
		payload,
	}),
	updateUser: (payload: IUser): IUpdatedUsersAction => ({
		type: UPDATED_USER,
		payload,
	}),
	resetUsers: (): IResetUsersAction => ({
		type: RESET_USERS,
	}),
}

// REDUCER
export default function reducer(
	state: UserState = [],
	action: UsersAction
): UserState {
	switch (action.type) {
		case GOT_USERS:
			return [...action.payload]
		case CREATED_USER:
			return [...state, action.payload]

		case UPDATED_USER:
			const index = state.findIndex((p) => p.id === action.payload.id)
			const users = [...state]
			users[index] = action.payload
			return [...users]
		case DELETED_USER:
			return state.filter((p) => p.id !== action.payload)
		case RESET_USERS:
			return []
		default:
			return state
	}
}

// OPERATIONS
export const getUsers = () =>
	executeAsyncAction(() => usersAPI.getUsers(), actions.gotUsers)

export const getUsersToReview = (
	reviewerId: number,
	status: userReviewsAPI.UserReviewStatus
) =>
	executeAsyncAction(
		() => userReviewsAPI.getUsersFromReviewerId(reviewerId, status),
		actions.gotUsers
	)

export const createUser = (newUser: Omit<IUser, "id"> & { password: string }) =>
	executeAsyncAction(() => usersAPI.postUser(newUser), actions.createUser)

export const updateUser = (
	userId: number,
	userProperties: Partial<Omit<IUser, "id">>
) =>
	executeAsyncAction(
		() => usersAPI.patchUser(userId, userProperties),
		actions.updateUser
	)

export const deleteUser = (userId: number) =>
	executeAsyncAction(
		() => usersAPI.deleteUser(userId),
		() => actions.deleteUser(userId)
	)
