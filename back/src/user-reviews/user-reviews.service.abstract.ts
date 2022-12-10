import { PerformanceReview } from "src/performance-reviews/perfomance-reviews.model"
import { User } from "src/users/users.model"
import { SubmitReviewDto } from "./dto/submit-review.dto"
import { UserReviewStatus } from "./user-review-status.enum.model"
import { UserReview } from "./user-reviews.model"

export abstract class AbstractUserReviewsService {
  abstract getUserReview(
    reviewerId: number,
    status: UserReviewStatus | undefined
  ): Promise<UserReview[]>

  abstract getUserReviewsFromPerformanceReviewId(
    performanceReviewId: number
  ): Promise<UserReview[]>

  abstract createEmptyUserReview(
    reviewer: User,
    performanceReview: PerformanceReview
  ): Promise<UserReview>

  abstract submitUserReview(
    reviewerId: number,
    performanceReviewId: number,
    reviewDto: SubmitReviewDto
  ): Promise<any>

  abstract deleteUserReview(
    performanceReviewId: number,
    reviewerId: number
  ): Promise<any>
}
