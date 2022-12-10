import { PerformanceReview } from "../perfomance-reviews.model"

export class GetPerformanceReviews {
  metadata: {
    next_cursor: string
  }
  search_result: PerformanceReview[]
}
