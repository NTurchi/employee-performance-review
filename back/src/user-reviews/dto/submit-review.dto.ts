import { IsNotEmpty, IsOptional, Max, Min } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"

/**
 * Submit review object
 *
 * @export
 * @class SubmitReviewDto
 */
export class SubmitReviewDto {
    @ApiProperty({ example: "This employee is a realy nice guy" })
    @IsOptional()
    comment: string

    @ApiProperty({ example: 3 })
    @IsNotEmpty()
    @Min(0)
    @Max(5)
    qualityOfWork: number

    @ApiProperty({ example: 3 })
    @IsNotEmpty()
    @Min(0)
    @Max(5)
    productivity: number

    @ApiProperty({ example: 3 })
    @IsNotEmpty()
    @Min(0)
    @Max(5)
    meetDeadline: number

    @ApiProperty({ example: 3 })
    @IsNotEmpty()
    @Min(0)
    @Max(5)
    knowledge: number

    @ApiProperty({ example: 3 })
    @IsNotEmpty()
    @Min(0)
    @Max(5)
    communication: number
}
