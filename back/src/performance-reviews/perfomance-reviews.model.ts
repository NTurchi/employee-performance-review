import {
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    ManyToOne
} from "typeorm"
import { User } from "../users/users.model"
import { UserReview } from "../user-reviews/user-reviews.model"

/**
 * Entity for PerformanceReview
 */
@Entity()
export class PerformanceReview {
    @PrimaryGeneratedColumn()
    public id: number

    @Column()
    public targetUserId: number

    /**
     * Target Employee of this performance review
     *
     * @type {string}
     * @memberof PerformanceReview
     */
    @ManyToOne(
        _ => User,
        u => u.performanceReviews,
        { cascade: true }
    )
    public targetUser: User

    /**
     * Review made by other employees for this performance review
     *
     * @type {UserReview[]}
     * @memberof PerformanceReview
     */
    @OneToMany(
        _ => UserReview,
        u => u.performanceReview
    )
    public userReviews: UserReview[]

    @Column({ type: "date" })
    public dueDate: string
}
