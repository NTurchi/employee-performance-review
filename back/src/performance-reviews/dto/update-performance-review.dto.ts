import { IsDateString, IsNotEmpty } from "class-validator"

export class UpdatePerformanceReviewDto {
    @IsNotEmpty()
    public reviewers: number[]

    @IsNotEmpty()
    @IsDateString()
    public dueDate: string
}
