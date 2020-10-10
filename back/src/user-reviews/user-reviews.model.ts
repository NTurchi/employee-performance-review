import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    PrimaryGeneratedColumn
} from "typeorm"
import { User } from "../users/users.model"
import { PerformanceReview } from "../performance-reviews/perfomance-reviews.model"
import { UserReviewStatus } from "./user-review-status.enum.model"
import { ManyToOne } from "typeorm"

/**
 * Entity for PerformanceReview
 */
@Entity()
export class UserReview {
    @PrimaryGeneratedColumn()
    public id: number

    @Column()
    public reviewerId: number

    @ManyToOne(
        _ => User,
        u => u.assignedReviews,
        { cascade: true }
    )
    public reviewer!: User

    @Column()
    public performanceReviewId: number

    @ManyToOne(
        _ => PerformanceReview,
        u => u.userReviews,
        { cascade: true }
    )
    public performanceReview!: PerformanceReview

    @Column()
    public status: UserReviewStatus

    @Column("text")
    public comment: string

    @Column("int8")
    public qualityOfWork: number

    @Column("int8")
    public productivity: number

    @Column("int8")
    public meetDeadline: number

    @Column("int8")
    public knowledge: number

    @Column("int8")
    public communication: number

    @Column("date", { nullable: true })
    submitDate: string | undefined
}
