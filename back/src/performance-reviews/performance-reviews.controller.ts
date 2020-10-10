import {
    Request,
    Controller,
    Post,
    UseGuards,
    Get,
    Query,
    Body,
    Patch,
    Param,
    NotFoundException
} from "@nestjs/common"
import { Roles } from "../users/roles.enum"
import { AbstractPerformanceReviewsService } from "./performance-reviews.service.abstract"
import { AuthRolesGuard, ForRoles, JwtAuthGuard } from "../auth"
import { GetPerformanceReviews } from "./dto/get-performance-reviews.dto"
import { PerformanceReview } from "src/performance-reviews/perfomance-reviews.model"
import { CreatePerformanceReviewDto } from "./dto/create-performance-reviews.dto"
import { UpdatePerformanceReviewDto } from "./dto/update-performance-review.dto"
import { JwtService } from "@nestjs/jwt"
import { BearerToken } from "../auth/bearer-token.decorator"
import { User } from "../users/users.model"
import { UserReviewStatus } from "../user-reviews/user-review-status.enum.model"
import { UserReview } from "src/user-reviews/user-reviews.model"
import { AbstractUserReviewsService } from "../user-reviews/user-reviews.service.abstract"

@Controller("performance-reviews")
@UseGuards(JwtAuthGuard, AuthRolesGuard)
export class PerformanceReviewController {
    constructor(
        private performanceReviewService: AbstractPerformanceReviewsService,
        private userReviewService: AbstractUserReviewsService,
        private jwtService: JwtService
    ) {}

    /**
     * Create performance reviews
     */
    @Post()
    @ForRoles(Roles.ADMIN)
    async createPerformanceReview(
        @Body() newPerfReview: CreatePerformanceReviewDto
    ): Promise<PerformanceReview> {
        return this.performanceReviewService.create(newPerfReview)
    }

    /**
     * Update performance reviews
     */
    @Patch("/:id")
    @ForRoles(Roles.ADMIN)
    async updatePerformanceReview(
        @Param("id") id: number,
        @Body() newPerfReview: UpdatePerformanceReviewDto
    ): Promise<PerformanceReview> {
        return this.performanceReviewService.updatePerformanceReview(
            id,
            newPerfReview
        )
    }

    /**
     * Get all performance reviews
     *
     * @param next_cursor Pagination cursor
     * @param q employee full name search
     */
    @Get()
    @ForRoles(Roles.ADMIN)
    async getAllPerformanceReviews(
        @Query("next_cursor") next_cursor: string | undefined,
        @Query("q") q: string | undefined
    ): Promise<GetPerformanceReviews> {
        return await this.performanceReviewService.getPerformanceReviews(
            next_cursor,
            q
        )
    }

    /**
     * Get performance review details from reviewer id
     *
     */
    @Get("my-reviews")
    @ForRoles(Roles.EMPLOYEE)
    async getPerformanceReviews(
        @BearerToken() bearer,
        @Query("status") status: UserReviewStatus
    ): Promise<PerformanceReview[]> {
        if (bearer) {
            const { id } = this.jwtService.decode(bearer) as any
            return await this.performanceReviewService.getPerformanceReviewsFromReviewerIdAndStatus(
                id,
                status
            )
        }
        throw new NotFoundException()
    }

    /**
     * Get user review from the performance review id
     *
     */
    @Get(":id/user-reviews")
    @ForRoles(Roles.ADMIN)
    async getUserReviewsFromPerformanceReviewId(
        @Param("id") performanceReviewId
    ): Promise<UserReview[]> {
        if (performanceReviewId) {
            return this.userReviewService.getUserReviewsFromPerformanceReviewId(
                performanceReviewId
            )
        }
        throw new NotFoundException()
    }

    /**
     * Get user review of a user
     *
     */
    @Get("/target-users")
    @ForRoles(Roles.EMPLOYEE)
    async getPerformanceReviewsTargetsUsersFromReviewerId(
        @BearerToken() bearer,
        @Query("status") status: UserReviewStatus
    ): Promise<
        {
            firstName: string
            lastName: string
            department: string
            id: number
        }[]
    > {
        if (bearer) {
            const { id } = this.jwtService.decode(bearer) as any
            return (
                await this.performanceReviewService.getPerformanceReviewsTargetUserFromReviewerIdAndStatus(
                    id,
                    status
                )
            ).map(({ firstName, lastName, department, id }) => ({
                firstName,
                lastName,
                department,
                id
            }))
        }
        throw new NotFoundException()
    }
}
