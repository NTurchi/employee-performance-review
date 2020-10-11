import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { User } from "../users/users.model"
import { PerformanceReview } from "../performance-reviews/perfomance-reviews.model"
import { UserReviewStatus } from "./user-review-status.enum.model"
import { ManyToOne } from "typeorm"
import { ApiProperty } from "@nestjs/swagger"

/**
 * Entity for User review
 */
@Entity()
export class UserReview {
    // GOT AN ISSUE WITH COMPOSITE KEY AND TYPEORM. So as a quick fix I used a usual primary key
    @PrimaryGeneratedColumn()
    public id: number

    @ApiProperty({ example: 1 })
    @Column()
    public reviewerId: number

    @ManyToOne((_) => User, (u) => u.assignedReviews, { cascade: true })
    public reviewer!: User

    @ApiProperty({ example: 1 })
    @Column()
    public performanceReviewId: number

    @ManyToOne((_) => PerformanceReview, (u) => u.userReviews, {
        cascade: true
    })
    public performanceReview!: PerformanceReview

    @ApiProperty({
        example: UserReviewStatus.SUBMITTED,
        enum: UserReviewStatus
    })
    @Column()
    public status: UserReviewStatus

    @ApiProperty({ example: 3 })
    @Column("text")
    public comment: string

    @ApiProperty({ example: 3 })
    @Column("int8")
    public qualityOfWork: number

    @ApiProperty({ example: 3 })
    @Column("int8")
    public productivity: number

    @ApiProperty({ example: 3 })
    @Column("int8")
    public meetDeadline: number

    @ApiProperty({ example: 3 })
    @Column("int8")
    public knowledge: number

    @ApiProperty({ example: 3 })
    @Column("int8")
    public communication: number

    @ApiProperty({ example: "2020-10-11T12:27:13+09:00" })
    @Column("date", { nullable: true })
    submitDate: string | undefined
}
