import { IsDateString, IsNotEmpty } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

export class CreatePerformanceReviewDto {
    @ApiProperty({ example: 1 })
    @IsNotEmpty()
    public targetUserId: number

    @ApiProperty({ example: [2, 3, 4] })
    @IsNotEmpty()
    public reviewers: number[]

    @ApiProperty({ example: "2020-10-11T12:27:13+09:00" })
    @IsNotEmpty()
    @IsDateString()
    public dueDate: string
}
