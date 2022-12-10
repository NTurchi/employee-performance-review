import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne
} from "typeorm"
import { User } from "../users/users.model"
import { UserReview } from "../user-reviews/user-reviews.model"
import { ApiProperty } from "@nestjs/swagger"

/**
 * Entity for PerformanceReview
 */
@Entity()
export class PerformanceReview {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  public id: number

  @ApiProperty({ example: 1 })
  @Column()
  public targetUserId: number

  /**
   * Target Employee of this performance review
   *
   * @type {string}
   * @memberof PerformanceReview
   */
  @ManyToOne((_) => User, (u) => u.performanceReviews, {
    cascade: true,
    onDelete: "CASCADE"
  })
  public targetUser: User

  /**
   * Review made by other employees for this performance review
   *
   * @type {UserReview[]}
   * @memberof PerformanceReview
   */
  @OneToMany((_) => UserReview, (u) => u.performanceReview)
  public userReviews: UserReview[]

  @ApiProperty({ example: "2020-10-11T12:27:13+09:00" })
  @Column({ type: "date" })
  public dueDate: string
}
