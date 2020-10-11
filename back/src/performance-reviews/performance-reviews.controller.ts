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
import { UserReviewStatus } from "../user-reviews/user-review-status.enum.model"
import { UserReview } from "src/user-reviews/user-reviews.model"
import { AbstractUserReviewsService } from "../user-reviews/user-reviews.service.abstract"
import {
    ApiBody,
    ApiCookieAuth,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiTags
} from "@nestjs/swagger"
import { UsersFromUserReviewDto } from "./dto/users-from-user-review.dto"

@ApiTags("Performance Reviews")
@ApiCookieAuth()
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
    @ApiOperation({
        description:
            "Create a performance review for a target employee (including reviewers)"
    })
    @ApiBody({
        description: "Performance Review Object",
        type: CreatePerformanceReviewDto
    })
    @ApiCreatedResponse({
        description: "Performance review created",
        type: PerformanceReview
    })
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
    @ApiOperation({
        description: "Update a performance review"
    })
    @ApiBody({
        description: "Performance Review Object",
        type: UpdatePerformanceReviewDto
    })
    @ApiOkResponse({
        description: "Performance Review updated",
        type: PerformanceReview
    })
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
    @ApiOperation({
        description: "Get all the performance reviews"
    })
    @ApiOkResponse({
        description: "Performance Reviews",
        type: GetPerformanceReviews
    })
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
    @ApiOperation({
        description:
            "Get the performance reviews that have to be submitted by the current user"
    })
    @ApiOkResponse({
        description: "Performance Reviews",
        type: PerformanceReview
    })
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
    @ApiOperation({
        description:
            "Get the reviews submitted by the employee for a given performance review"
    })
    @ApiOkResponse({
        description: "User Reviews",
        type: UserReview
    })
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
    @ApiOperation({
        description: "Get the users that have be reviewed by the current user"
    })
    @ApiOkResponse({
        description: "Users",
        type: UserReview
    })
    async getPerformanceReviewsTargetsUsersFromReviewerId(
        @BearerToken() bearer,
        @Query("status") status: UserReviewStatus
    ): Promise<UsersFromUserReviewDto[]> {
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
