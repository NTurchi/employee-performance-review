import { ApiProperty } from "@nestjs/swagger"
import { Roles } from "../roles.enum"
import {
    IsEmail,
    IsNotEmpty,
    IsArray,
    ArrayUnique,
    ArrayMaxSize,
    ArrayNotEmpty,
    IsEnum
} from "class-validator"

export class UpdateUserDto {
    @ApiProperty({ example: "david@test.jp" })
    @IsEmail()
    mail: string

    @ApiProperty({ enum: Roles, type: "array", example: [Roles.ADMIN] })
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @ArrayMaxSize(2)
    @IsEnum(Roles, { each: true })
    roles: Roles[]

    @ApiProperty({ example: "David" })
    @IsNotEmpty()
    firstName: string

    @ApiProperty({ example: "Bob" })
    @IsNotEmpty()
    lastName: string

    @ApiProperty({ example: "Development" })
    @IsNotEmpty()
    department: string
}
