import { baseUrl, patchRequest, baseRequestAxios } from "./common"
import { IPerformanceReview } from "./perfomanceReviews"
import { IUser } from "./users"
import axios from "axios"

// REVIEW MADE BY ONE USER FOR ONE PERFORMANCE REVIEW
export enum UserReviewStatus {
	NOT_SUBMITTED = "NOT_SUBMITTED",
	SUBMITTED = "SUBMITTED",
}

export interface IUserReviewCriteria {
	qualityOfWork: number
	productivity: number
	meetDeadline: number
	knowledge: number
	communication: number
}

export interface IUserReview extends IUserReviewCriteria {
	performanceReviewId: number
	reviewerId: number
	comment: string
	status: UserReviewStatus
	submitDate: string | undefined
}

export interface ISubmitUserReview
	extends Omit<IUserReview, "status" | "performanceReviewsId"> {}

export const submitUserReview = patchRequest<ISubmitUserReview, IUserReview>(
	`user-reviews`
)

export const getUserReviewsFromPerformanceReview = (
	performanceReviewId: number
): Promise<IUserReview[]> =>
	baseRequestAxios(
		axios.get(
			`${baseUrl}/performance-reviews/${performanceReviewId}/user-reviews`,
			{
				withCredentials: true,
			}
		)
	)

export const getUserReviewsFromReviewerIdAndByStatus = (
	reviewerId: number,
	status: UserReviewStatus
): Promise<IUserReview[]> =>
	baseRequestAxios(
		axios.get(`${baseUrl}/user-reviews?status=${status}`, {
			withCredentials: true,
		})
	)

/**
 * Get the performance reviews list from reviewer id
 *
 * @export
 * @param {string | undefined} filterByFullName
 * @returns
 */
export const getPerformanceReviewsFromReviewerId = (
	reviewerId: number,
	status: UserReviewStatus
): Promise<IPerformanceReview[]> =>
	baseRequestAxios(
		axios.get(
			`${baseUrl}/performance-reviews/my-reviews?status=${status}`,
			{
				withCredentials: true,
			}
		)
	)

/**
 * Get the users informations from the performance review that has to be submit by the current user
 *
 * @param reviewerId current user
 */
export const getUsersFromReviewerId = (
	reviewerId: number,
	status: UserReviewStatus
): Promise<IUser[]> =>
	baseRequestAxios(
		axios.get(
			`${baseUrl}/performance-reviews/target-users?status=${status}`,
			{
				withCredentials: true,
			}
		)
	)
