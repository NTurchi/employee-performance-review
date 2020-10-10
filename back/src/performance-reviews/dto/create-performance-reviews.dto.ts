import { IsDateString, IsNotEmpty } from "class-validator"

export class CreatePerformanceReviewDto {
    @IsNotEmpty()
    public targetUserId: number

    @IsNotEmpty()
    public reviewers: number[]

    @IsNotEmpty()
    @IsDateString()
    public dueDate: string
}
