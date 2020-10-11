import { Roles } from "../roles.enum"
import { IsNotEmpty, Matches } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import { UpdateUserDto } from "./update-user.dto"

export class CreateUserDto extends UpdateUserDto {
    @ApiProperty({ example: "securePassword_19" })
    @IsNotEmpty()
    @Matches(
        new RegExp(
            "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})"
        )
    )
    password: string
}
