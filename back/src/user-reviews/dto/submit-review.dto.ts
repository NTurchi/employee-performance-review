import { IsEmail, IsNotEmpty, IsOptional, Max, Min } from "class-validator"

/**
 * Submit review object
 *
 * @export
 * @class SubmitReviewDto
 */
export class SubmitReviewDto {
    @IsOptional()
    comment: string

    @IsNotEmpty()
    @Min(0)
    @Max(5)
    qualityOfWork: number

    @IsNotEmpty()
    @Min(0)
    @Max(5)
    productivity: number

    @IsNotEmpty()
    @Min(0)
    @Max(5)
    meetDeadline: number

    @IsNotEmpty()
    @Min(0)
    @Max(5)
    knowledge: number

    @IsNotEmpty()
    @Min(0)
    @Max(5)
    communication: number
}
