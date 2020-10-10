import { performanceReviewsAPI, userReviewsAPI } from "../../api"
import {
	executeAsyncAction,
	IAction,
	IActionWithPayload,
	ICursorPagination,
} from "./common"

/**
 * Review feature
 */

// State
export interface IPerformanceReview
	extends performanceReviewsAPI.IPerformanceReview {}

/**
 *  PERFORMANCE REVIEW STATE
 */
export interface IPerformanceReviewsState {
	performanceReviews: IPerformanceReview[]
	metadata: ICursorPagination
}

const initialPerformanceReviewsState = {
	performanceReviews: [],
	metadata: {
		prev: undefined,
		next: undefined,
	},
}

// Actions & Actions Type
const GOT_PERFOMANCE_REVIEWS = "app/performance-reviews/GOT_PERFOMANCE_REVIEWS"
const CREATED_PERFORMANCE_REVIEWS =
	"app/performance-reviews/CREATED_PERFOMANCE_REVIEWS"
const UPDATED_PERFORMANCE_REVIEWS =
	"app/performance-reviews/UPDATED_PERFORMANCE_REVIEWS"
const RESET_PERFORMANCE_REVIEWS =
	"app/performance-reviews/RESET_PERFORMANCE_REVIEWS"

// ACTIONS TYPES
interface IGotPerformanceReviewsAction
	extends IActionWithPayload<
		typeof GOT_PERFOMANCE_REVIEWS,
		IPerformanceReviewsState
	> {}

interface ICreatedPerformanceReviewsAction
	extends IActionWithPayload<
		typeof CREATED_PERFORMANCE_REVIEWS,
		IPerformanceReview
	> {}

interface IUpdatedPerformanceReviewsAction
	extends IActionWithPayload<
		typeof UPDATED_PERFORMANCE_REVIEWS,
		IPerformanceReview
	> {}

interface IResetPerformanceReviewsAction
	extends IAction<typeof RESET_PERFORMANCE_REVIEWS> {}

type PerformanceReviewsAction =
	| IGotPerformanceReviewsAction
	| ICreatedPerformanceReviewsAction
	| IUpdatedPerformanceReviewsAction
	| IResetPerformanceReviewsAction

// ACTIONS CREATOR
export const actions = {
	gotPerformanceReviews: (
		payload: IPerformanceReviewsState
	): IGotPerformanceReviewsAction => ({
		type: GOT_PERFOMANCE_REVIEWS,
		payload,
	}),
	createPerformanceReview: (
		payload: IPerformanceReview
	): ICreatedPerformanceReviewsAction => ({
		type: CREATED_PERFORMANCE_REVIEWS,
		payload,
	}),
	updatePerformanceReview: (
		payload: IPerformanceReview
	): IUpdatedPerformanceReviewsAction => ({
		type: UPDATED_PERFORMANCE_REVIEWS,
		payload,
	}),
	resetPerformanceReviews: (): IResetPerformanceReviewsAction => ({
		type: RESET_PERFORMANCE_REVIEWS,
	}),
}

// REDUCER
export default function reducer(
	state: IPerformanceReviewsState = initialPerformanceReviewsState,
	action: PerformanceReviewsAction
) {
	switch (action.type) {
		case GOT_PERFOMANCE_REVIEWS:
			return {
				metadata: action.payload.metadata,
				performanceReviews: [
					...state.performanceReviews,
					...action.payload.performanceReviews,
				],
			}
		case CREATED_PERFORMANCE_REVIEWS:
			return {
				...state,
				performanceReviews: [
					...state.performanceReviews,
					action.payload,
				],
			}
		case UPDATED_PERFORMANCE_REVIEWS:
			const index = state.performanceReviews.findIndex(
				(p) => p.id === action.payload.id
			)
			const performanceReviews = [...state.performanceReviews]
			performanceReviews[index] = action.payload
			return { ...state, performanceReviews }
		case RESET_PERFORMANCE_REVIEWS:
			return initialPerformanceReviewsState
		default:
			return state
	}
}

// OPERATIONS
export const getPerformanceReviews = (
	fullName: string | undefined,
	nextCursor: string | undefined
) =>
	executeAsyncAction(
		() => performanceReviewsAPI.getPerformanceReviews(fullName, nextCursor),
		({ metadata, search_result }) =>
			actions.gotPerformanceReviews({
				metadata: { next: metadata.next_cursor, prev: undefined },
				performanceReviews: search_result,
			})
	)

export const getPermorfanceReviewsFromReviewerId = (
	reviewerId: number,
	status: userReviewsAPI.UserReviewStatus
) =>
	executeAsyncAction(
		() =>
			userReviewsAPI.getPerformanceReviewsFromReviewerId(
				reviewerId,
				status
			),
		(res) =>
			actions.gotPerformanceReviews({
				metadata: { prev: undefined, next: undefined },
				performanceReviews: res,
			})
	)

export const createPerformanceReview = (
	peformanceReview: performanceReviewsAPI.IPostPerformanceReviewParms
) =>
	executeAsyncAction(
		() => performanceReviewsAPI.postPerformanceReview(peformanceReview),
		actions.createPerformanceReview
	)

export const updatePerformanceReview = (
	performanceReviewId: number,
	{ dueDate, reviewers }: { dueDate: string; reviewers: number[] }
) =>
	executeAsyncAction(
		() =>
			performanceReviewsAPI.patchPerformanceReview(performanceReviewId, {
				dueDate,
				reviewers,
			}),
		actions.updatePerformanceReview
	)
