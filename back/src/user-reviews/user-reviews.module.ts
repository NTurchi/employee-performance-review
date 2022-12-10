import { Module, Provider } from "@nestjs/common"
import { UserReviewsService } from "./user-reviews.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserReview } from "./user-reviews.model"
import { AbstractUserReviewsService } from "./user-reviews.service.abstract"
import { UserReviewsController } from "./user-review.controller"

const userReviewsServiceProvider: Provider<AbstractUserReviewsService> = {
  useClass: UserReviewsService,
  provide: AbstractUserReviewsService
}

@Module({
  providers: [userReviewsServiceProvider],
  imports: [TypeOrmModule.forFeature([UserReview])],
  exports: [userReviewsServiceProvider],
  controllers: [UserReviewsController]
})
export class UserReviewsModule {}
