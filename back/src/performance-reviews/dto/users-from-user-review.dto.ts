import { ApiProperty } from "@nestjs/swagger"

export class UsersFromUserReviewDto {
  @ApiProperty({ example: "Nicolas" })
  firstName: string

  @ApiProperty({ example: "Fish" })
  lastName: string

  @ApiProperty({ example: "Development" })
  department: string

  @ApiProperty({ example: 1 })
  id: number
}
