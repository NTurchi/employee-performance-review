import { Module, Provider } from "@nestjs/common"
import { PerformanceReviewsService } from "./performance-reviews.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { PerformanceReview } from "./perfomance-reviews.model"
import { AbstractPerformanceReviewsService } from "./performance-reviews.service.abstract"
import { PerformanceReviewController } from "./performance-reviews.controller"
import { AuthModule } from "../auth/auth.module"
import { UsersModule } from "../users/users.module"
import { UserReviewsModule } from "../user-reviews/user-reviews.module"

const performanceReviewsServiceProvider: Provider<AbstractPerformanceReviewsService> = {
  useClass: PerformanceReviewsService,
  provide: AbstractPerformanceReviewsService
}

@Module({
  providers: [performanceReviewsServiceProvider],
  imports: [
    TypeOrmModule.forFeature([PerformanceReview]),
    AuthModule,
    UsersModule,
    UserReviewsModule
  ],
  exports: [performanceReviewsServiceProvider],
  controllers: [PerformanceReviewController]
})
export class PerformanceReviewsModule {}
