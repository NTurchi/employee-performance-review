import {
    Controller,
    UseGuards,
    Get,
    Query,
    NotFoundException,
    Patch,
    Param,
    Body
} from "@nestjs/common"
import { Roles } from "../users/roles.enum"
import { AuthRolesGuard, ForRoles, JwtAuthGuard } from "../auth"

import { UserReviewStatus } from "./user-review-status.enum.model"
import { AbstractUserReviewsService } from "./user-reviews.service.abstract"
import { UserReview } from "./user-reviews.model"
import { JwtService } from "@nestjs/jwt"
import { Request } from "@nestjs/common"
import { SubmitReviewDto } from "./dto/submit-review.dto"
import { BearerToken } from "../auth/bearer-token.decorator"

@Controller("user-reviews")
@UseGuards(JwtAuthGuard, AuthRolesGuard)
export class UserReviewsController {
    constructor(
        private userReviewService: AbstractUserReviewsService,
        private jwtService: JwtService
    ) {}

    /**
     * Get user review of the current user
     *
     */
    @Get()
    @ForRoles(Roles.EMPLOYEE)
    async getUserReviews(
        @Query("status") status: UserReviewStatus | undefined,
        @BearerToken() bearer
    ): Promise<UserReview[]> {
        if (bearer) {
            const { id } = this.jwtService.decode(bearer) as any
            return await this.userReviewService.getUserReview(id, status)
        }
        throw new NotFoundException()
    }

    /**
     * Submit user review
     *
     */
    @Patch("/:performanceReviewId")
    @ForRoles(Roles.EMPLOYEE)
    async submitUserReview(
        @Param("performanceReviewId") perfId: number,
        @Body() dto: SubmitReviewDto,
        @BearerToken() bearer
    ): Promise<UserReview[]> {
        if (bearer && perfId) {
            const { id } = this.jwtService.decode(bearer) as any
            return await this.userReviewService.submitUserReview(
                id,
                perfId,
                dto
            )
        }
        throw new NotFoundException()
    }
}
