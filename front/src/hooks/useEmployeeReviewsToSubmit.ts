import { getUsersToReview, IUser } from "../state/ducks/users"
import {
	getPermorfanceReviewsFromReviewerId,
	IPerformanceReview,
} from "../state/ducks/performanceReviews"

import useUniqueEffect from "./useUniqueEffect"
import { useDispatch, useSelector } from "react-redux"
import { IUserReview, UserReviewStatus } from "../api/userReview"
import { getUserReviewsFromReviewerId } from "../state/ducks/userReviews"
import AppState from "../state/index"

/**
 * DTO Object - Performance review that has not yet been submitted by the employee
 */
export interface INotSubmittedPerformanceReview extends IUserReview {
	targetEmployee?: IUser
	performanceReview?: IPerformanceReview
}

/**
 * Get all the performance review that has to be submitted by the current user (as well as the related (target employee, performance review...))
 * @param userId current employee id
 */
const useEmployeeReviewsToSubmit = (
	userId: number
): [INotSubmittedPerformanceReview[], () => void] => {
	const dispatch = useDispatch()

	// SELECTOR
	const users = useSelector<AppState, IUser[]>((state) => state.users)
	const userReviews = useSelector<AppState, IUserReview[]>(
		(state) => state.userReviews
	)
	const performanceReviews = useSelector<AppState, IPerformanceReview[]>(
		(state) => state.performanceReviews.performanceReviews
	)

	// MAP TO IUserReview to INotSubmittedPerformanceReview
	const mapToINotSubmittedPerformanceReview = (review: IUserReview) => {
		const performanceReview = performanceReviews.find(
			(p) => p.id === review.performanceReviewId
		)
		const targetEmployee = users.find(
			(p) => p.id === performanceReview?.targetUserId || false
		)
		return {
			targetEmployee,
			performanceReview,
			...review,
		}
	}
	const reload = () => {
		dispatch(
			getUserReviewsFromReviewerId(userId, UserReviewStatus.NOT_SUBMITTED)
		)
		dispatch(getUsersToReview(userId, UserReviewStatus.NOT_SUBMITTED))
		dispatch(
			getPermorfanceReviewsFromReviewerId(
				userId,
				UserReviewStatus.NOT_SUBMITTED
			)
		)
	}

	useUniqueEffect(reload)

	return [userReviews.map(mapToINotSubmittedPerformanceReview), reload]
}

export default useEmployeeReviewsToSubmit
