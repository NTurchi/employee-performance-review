import { AbstractUserReviewsService } from "./user-reviews.service.abstract"
import { UserReview } from "./user-reviews.model"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { SubmitReviewDto } from "./dto/submit-review.dto"
import { PerformanceReview } from "../performance-reviews/perfomance-reviews.model"
import { User } from "../users/users.model"
import { BadRequestException, HttpException, HttpStatus } from "@nestjs/common"
import { UserReviewStatus } from "./user-review-status.enum.model"
const moment = require("moment")

export class UserReviewsService implements AbstractUserReviewsService {
  constructor(
    @InjectRepository(UserReview)
    private repo: Repository<UserReview>
  ) {}

  /**
   * Get all the user reviews from a performance review
   *
   * @param {number} performanceReviewId
   * @returns {Promise<UserReview[]>}
   * @memberof UserReviewsService
   */
  async getUserReviewsFromPerformanceReviewId(
    performanceReviewId: number
  ): Promise<UserReview[]> {
    return this.repo.find({ performanceReviewId })
  }

  /**
   * Get a user review by performance review
   *
   * @param {number} performanceReviewId
   * @returns {(Promise<UserReview | undefined>)}
   * @memberof UserReviewsService
   */
  async getUserReviewByPerformanceReviewId(
    performanceReviewId: number
  ): Promise<UserReview | undefined> {
    return await this.repo.findOne({ performanceReviewId })
  }

  /**
   * Get user reviews of a reviewer
   * @param reviewerId
   * @param status
   */
  async getUserReview(
    reviewerId: number,
    status: UserReviewStatus | undefined
  ): Promise<UserReview[]> {
    if (
      (status && status === UserReviewStatus.NOT_SUBMITTED) ||
      status === UserReviewStatus.SUBMITTED
    ) {
      return this.repo.find({ reviewerId, status })
    }
    return this.repo.find({ reviewerId })
  }

  /**
   * Delete a user review
   *
   * @param {number} performanceReviewId
   * @param {number} reviewerId
   * @returns {Promise<any>}
   * @memberof UserReviewsService
   */
  async deleteUserReview(
    performanceReviewId: number,
    reviewerId: number
  ): Promise<any> {
    const entity = await this.repo.findOne({
      performanceReviewId,
      reviewerId
    })
    if (!entity) {
      throw new HttpException("User review not found", HttpStatus.NOT_FOUND)
    }
    return await this.repo.delete({
      performanceReviewId,
      reviewerId
    })
  }

  /**
   * Create a default user review for a given performance review and a reviewer
   *
   * @param {User} reviewer
   * @param {PerformanceReview} performanceReview
   * @memberof UserReviewsService
   */
  async createEmptyUserReview(
    reviewer: User,
    performanceReview: PerformanceReview
  ): Promise<UserReview> {
    const newEntity = await this.repo.create({
      reviewer,
      performanceReview,
      comment: "",
      communication: 3,
      meetDeadline: 3,
      qualityOfWork: 3,
      productivity: 3,
      knowledge: 3,
      status: UserReviewStatus.NOT_SUBMITTED
    })
    const entity = await this.repo.create(newEntity)
    return await this.repo.save(entity)
  }

  /**
   * Employee submit a performance review
   *
   * @param reviewerId
   * @param performanceReviewId
   * @param reviewDto
   */
  async submitUserReview(
    reviewerId: number,
    performanceReviewId: number,
    reviewDto: SubmitReviewDto
  ): Promise<UserReview> {
    const entity = await this.repo.findOne({
      reviewerId,
      performanceReviewId
    })
    if (!entity) {
      throw new HttpException("User review not found", HttpStatus.NOT_FOUND)
    }

    if (entity.status === UserReviewStatus.SUBMITTED) {
      throw new BadRequestException(
        "This performance review has already been submitted"
      )
    }

    return await this.repo.save({
      ...entity,
      ...reviewDto,
      submitDate: moment().format(),
      status: UserReviewStatus.SUBMITTED
    })
  }
}
