import { userReviewsAPI } from "../../api"
import { executeAsyncAction, IActionWithPayload } from "./common"

/**
 * User Review feature
 */

// State

/**
 *  USERS STATE
 */
export interface IUserReview extends userReviewsAPI.IUserReview {}

type UserReviewsState = IUserReview[]

// Actions & Actions Type
const GOT_USERS_REVIEWS = "app/user-reviews/GOT_USERS_REVIEWS"
const SUBMITTED_USER_REVIEWS = "app/user-reviews/SUBMITED_USERS_REVIEWS"

interface IUserReviewId {
	reviewerId: number
	performanceReviewId: number
}

// ACTIONS TYPES
interface IGotUserReviewsAction
	extends IActionWithPayload<typeof GOT_USERS_REVIEWS, UserReviewsState> {}

interface ISubmittedUserReviewsAction
	extends IActionWithPayload<typeof SUBMITTED_USER_REVIEWS, IUserReviewId> {}

type UserReviewsAction = IGotUserReviewsAction | ISubmittedUserReviewsAction

// ACTIONS CREATOR
export const actions = {
	gotUserReviews: (payload: UserReviewsState): IGotUserReviewsAction => ({
		type: GOT_USERS_REVIEWS,
		payload,
	}),
	submitUserReview: (
		payload: IUserReviewId
	): ISubmittedUserReviewsAction => ({
		type: SUBMITTED_USER_REVIEWS,
		payload,
	}),
}

// REDUCER
export default function reducer(
	state: UserReviewsState = [],
	action: UserReviewsAction
): UserReviewsState {
	switch (action.type) {
		case GOT_USERS_REVIEWS:
			return [...action.payload]
		case SUBMITTED_USER_REVIEWS:
			return state.filter(
				(u) =>
					!(
						u.performanceReviewId ===
							action.payload.performanceReviewId &&
						u.reviewerId === action.payload.reviewerId
					)
			)
		default:
			return state
	}
}

// OPERATIONS
export const getUserReviewsFromPerformanceReview = (
	performanceReviewId: number
) =>
	executeAsyncAction(
		() =>
			userReviewsAPI.getUserReviewsFromPerformanceReview(
				performanceReviewId
			),
		actions.gotUserReviews
	)

export const getUserReviewsFromReviewerId = (
	reviewerId: number,
	status: userReviewsAPI.UserReviewStatus
) =>
	executeAsyncAction(
		() =>
			userReviewsAPI.getUserReviewsFromReviewerIdAndByStatus(
				reviewerId,
				status
			),
		actions.gotUserReviews
	)

export const submitUserReview = (
	performanceReviewId: number,
	userReview: userReviewsAPI.ISubmitUserReview
) =>
	executeAsyncAction(
		() => userReviewsAPI.submitUserReview(performanceReviewId, userReview),
		() =>
			actions.submitUserReview({
				reviewerId: userReview.reviewerId,
				performanceReviewId,
			})
	)
