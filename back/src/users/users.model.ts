import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { PerformanceReview } from "../performance-reviews/perfomance-reviews.model"
import { UserReview } from "../user-reviews/user-reviews.model"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    public id: number

    @Column()
    public mail: string

    @Column()
    public firstName: string

    @Column()
    public lastName: string

    @Column("text")
    public password: string

    @Column()
    public department: string

    /**
     * No time to implements a many to many relationship.
     * [ADMIN, ROLES] becomes "ADMIN,ROLES"
     *
     * @type {string}
     * @memberof User
     */
    @Column()
    public roles: string

    @ManyToOne(
        _ => PerformanceReview,
        p => p.targetUser
    )
    public performanceReviews: PerformanceReview[]

    @ManyToOne(
        _ => UserReview,
        u => u.reviewer
    )
    public assignedReviews: UserReview[]
}
