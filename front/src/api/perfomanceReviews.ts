import { baseRequestAxios } from "./common"
import axios from "axios"
import {
	baseUrl,
	getQueryParamsStringFromArray,
	IResultWithCursorMetadata,
	patchRequest,
	postRequest,
} from "./common"

export interface IPerformanceReview {
	id: number
	targetUserId: number
	dueDate: string
}

interface IGetPerformanceReviewsResult
	extends IResultWithCursorMetadata<IPerformanceReview> {}

/**
 * Get the performance reviews list (Admin view)
 *
 * @export
 * @param {string | undefined} filterByFullName
 * @returns
 */
export function getPerformanceReviews(
	fullName: string | undefined,
	nextCursor: string | undefined
): Promise<IGetPerformanceReviewsResult> {
	const queryParamsStr: string = getQueryParamsStringFromArray([
		["q", fullName],
		["next_cursor", nextCursor?.toString()],
	])
	return baseRequestAxios(
		axios.get(`${baseUrl}/performance-reviews${queryParamsStr}`, {
			withCredentials: true,
		})
	)
}

export const patchPerformanceReview = patchRequest<
	{ dueDate: string; reviewers: number[] },
	IPerformanceReview
>("performance-reviews")

export interface IPostPerformanceReviewParms {
	targetUserId: number
	dueDate: string
	reviewers: number[]
}

export const postPerformanceReview = postRequest<
	IPostPerformanceReviewParms,
	IPerformanceReview
>("performance-reviews")
