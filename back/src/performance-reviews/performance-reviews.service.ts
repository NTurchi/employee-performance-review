import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Injectable, HttpException, HttpStatus } from "@nestjs/common"
import { PerformanceReview } from "./perfomance-reviews.model"
import { AbstractPerformanceReviewsService } from "./performance-reviews.service.abstract"
import { UpdatePerformanceReviewDto } from "./dto/update-performance-review.dto"
import { CreatePerformanceReviewDto } from "./dto/create-performance-reviews.dto"
import { AbstractUsersService } from "../users/users.service.abstract"
import { AbstractUserReviewsService } from "../user-reviews/user-reviews.service.abstract"
import { UserReview } from "src/user-reviews/user-reviews.model"
import { buildPaginator } from "typeorm-cursor-pagination"
import { GetPerformanceReviews } from "./dto/get-performance-reviews.dto"
import { User } from "../users/users.model"
import { UserReviewStatus } from "../user-reviews/user-review-status.enum.model"

/**
 * Performance Reviews service implementation
 *
 * @export
 * @class PerformanceReviewsService
 * @implements {AbstractPerformanceReviewsService}
 */
@Injectable()
export class PerformanceReviewsService
    implements AbstractPerformanceReviewsService {
    constructor(
        @InjectRepository(PerformanceReview)
        private repo: Repository<PerformanceReview>,
        private usersService: AbstractUsersService,
        private userReviewService: AbstractUserReviewsService
    ) {}

    private paginator = (afterCursor: string | undefined) =>
        buildPaginator({
            entity: PerformanceReview,
            query: {
                limit: 30,
                order: "ASC",
                afterCursor
            }
        })

    /**
     * Get the performance review details where the current user is on of the reviewer
     * @param reviewerId
     */
    async getPerformanceReviewsFromReviewerIdAndStatus(
        reviewerId: number,
        status: UserReviewStatus
    ): Promise<PerformanceReview[]> {
        return this.repo
            .createQueryBuilder("performancereview")
            .innerJoin("performancereview.userReviews", "review")
            .where("review.reviewerId = :reviewerId", {
                reviewerId
            })
            .andWhere("review.status = :status", { status })
            .getMany()
    }

    /**
     * Get the performance review target user where the current user is one of the reviewer
     * @param reviewerId
     */
    async getPerformanceReviewsTargetUserFromReviewerIdAndStatus(
        reviewerId: number,
        status: UserReviewStatus
    ): Promise<User[]> {
        const prs = await this.getPerformanceReviewsFromReviewerIdAndStatus(
            reviewerId,
            status
        )
        return this.usersService.getUserByIds(prs.map((p) => p.targetUserId))
    }

    async getPerformanceReviews(
        cursor: string | undefined,
        employeeName?: string | undefined
    ): Promise<GetPerformanceReviews> {
        let query
        if (employeeName) {
            query = this.repo
                .createQueryBuilder("performancereview")
                .innerJoin("performancereview.targetUser", "user")
                .where("user.firstName LIKE :employeeName", {
                    employeeName: `%${employeeName}%`
                })
                .orWhere("user.lastName LIKE :employeeName", {
                    employeeName: `%${employeeName}%`
                })
        } else {
            query = this.repo.createQueryBuilder()
        }
        const result = await this.paginator(cursor).paginate(query)
        return {
            metadata: { next_cursor: result.cursor.afterCursor },
            search_result: result.data
        }
    }

    getPerformanceReviewById(
        id: number
    ): Promise<PerformanceReview | undefined> {
        return this.repo.findOne(id)
    }

    /**
     * Create a new performance review and the coresponding user reviews
     *
     * @param {CreatePerformanceReviewDto} dto
     * @returns {Promise<PerformanceReview>}
     * @memberof PerformanceReviewsService
     */
    async create(dto: CreatePerformanceReviewDto): Promise<PerformanceReview> {
        const user = await this.usersService.getUserById(dto.targetUserId)
        if (!user) {
            throw new HttpException(
                "Target employee not found",
                HttpStatus.NOT_FOUND
            )
        }
        const reviewers = dto.reviewers
        delete dto.reviewers
        const entity = await this.repo.create({ ...dto })
        const newPerformanceReview = await this.repo.save(entity)
        newPerformanceReview.userReviews = []
        for (const reviewerId of reviewers) {
            const emptyReview = await this.createAUserReviewIfUserExist(
                reviewerId,
                newPerformanceReview
            )
            if (emptyReview) {
                // created ampty user review
                newPerformanceReview.userReviews = [
                    ...newPerformanceReview.userReviews,
                    {
                        ...emptyReview,
                        reviewer: undefined,
                        performanceReview: undefined
                    }
                ]
            }
        }
        return newPerformanceReview
    }

    async updatePerformanceReview(
        id: number,
        dto: UpdatePerformanceReviewDto
    ): Promise<PerformanceReview> {
        const performanceReview = await this.repo.findOne(id, {
            relations: ["userReviews"]
        })
        if (!performanceReview) {
            throw new HttpException(
                "Performance review not found",
                HttpStatus.NOT_FOUND
            )
        }
        const reviewers = dto.reviewers
        delete dto.reviewers
        const entity = await this.repo.create({ ...performanceReview, ...dto })
        const newPerformanceReview = await this.repo.save(entity)
        newPerformanceReview.userReviews = []

        // new reviewer
        for (const reviewerId of reviewers) {
            let review = performanceReview.userReviews.find(
                (u) => u.reviewerId === reviewerId
            )
            if (!review) {
                review = await this.createAUserReviewIfUserExist(
                    reviewerId,
                    performanceReview
                )
            }
            // created ampty user review
            newPerformanceReview.userReviews = [
                ...newPerformanceReview.userReviews,
                ...(review
                    ? [
                          {
                              ...review,
                              reviewer: undefined,
                              performanceReview: undefined
                          }
                      ]
                    : [])
            ]
        }

        // delete unselected reviewers
        const unselectedReviewers = performanceReview.userReviews.filter(
            (u) => !reviewers.find((id) => u.reviewerId === id)
        )
        for (const reviewer of unselectedReviewers) {
            await this.userReviewService.deleteUserReview(
                reviewer.performanceReviewId,
                reviewer.reviewerId
            )
        }

        return newPerformanceReview
    }

    private async createAUserReviewIfUserExist(
        userId: number,
        performanceReview: PerformanceReview
    ): Promise<UserReview | undefined> {
        const reviewer = await this.usersService.getUserById(userId)
        if (reviewer) {
            const emptyReview = await this.userReviewService.createEmptyUserReview(
                reviewer,
                performanceReview
            )
            return emptyReview
        }
    }
}
