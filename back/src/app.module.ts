import { Module } from "@nestjs/common"
import { UsersModule } from "./users/users.module"
import { TypeOrmModule } from "@nestjs/typeorm"
import * as path from "path"
import { User } from "./users/users.model"
import { ConfigModule } from "@nestjs/config"
import { PerformanceReview } from "./performance-reviews/perfomance-reviews.model"
import { PerformanceReviewsModule } from "./performance-reviews/performance-reviews.module"
import { AuthModule } from "./auth"
import { UserReviewsModule } from "./user-reviews/user-reviews.module"
import { UserReview } from "./user-reviews/user-reviews.model"

@Module({
    imports: [
        AuthModule,
        UserReviewsModule,
        UsersModule,
        PerformanceReviewsModule,
        TypeOrmModule.forRoot({
            type: "sqlite",
            database: `${path.resolve(
                __dirname,
                ".."
            )}/db/performance-review-app.sqlite`,
            entities: [User, PerformanceReview, UserReview],
            synchronize: true
        }),
        ConfigModule.forRoot({
            isGlobal: true
        })
    ]
})
export class AppModule {}
