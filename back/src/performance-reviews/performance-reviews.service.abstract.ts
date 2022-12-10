import { CreatePerformanceReviewDto } from "./dto/create-performance-reviews.dto"
import { UpdatePerformanceReviewDto } from "./dto/update-performance-review.dto"
import { PerformanceReview } from "./perfomance-reviews.model"
import { UserReview } from "../user-reviews/user-reviews.model"
import { User } from "../users/users.model"
import { UserReviewStatus } from "../user-reviews/user-review-status.enum.model"
import { GetPerformanceReviews } from "./dto/get-performance-reviews.dto"

export abstract class AbstractPerformanceReviewsService {
  abstract getPerformanceReviews(
    cursor: string | undefined,
    employeeName?: string | undefined
  ): Promise<GetPerformanceReviews>

  abstract getPerformanceReviewsFromReviewerIdAndStatus(
    reviewerId: number,
    status: UserReviewStatus
  ): Promise<PerformanceReview[]>

  abstract getPerformanceReviewsTargetUserFromReviewerIdAndStatus(
    reviewerId: number,
    status: UserReviewStatus
  ): Promise<User[]>

  abstract getPerformanceReviewById(
    id: number
  ): Promise<PerformanceReview | undefined>

  abstract create(dto: CreatePerformanceReviewDto): Promise<PerformanceReview>

  abstract updatePerformanceReview(
    id: number,
    dto: UpdatePerformanceReviewDto
  ): Promise<PerformanceReview>
}
