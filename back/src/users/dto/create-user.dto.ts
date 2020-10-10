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

export class CreateUserDto {
    @IsEmail()
    mail: string

    // @IsNotEmpty()
    // @Matches(
    //     new RegExp(
    //         "^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{8,})"
    //     )
    // )
    password: string

    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @ArrayMaxSize(2)
    @IsEnum(Roles, { each: true })
    roles: Roles[]

    @IsNotEmpty()
    firstName: string

    @IsNotEmpty()
    lastName: string

    @IsNotEmpty()
    department: string
}
