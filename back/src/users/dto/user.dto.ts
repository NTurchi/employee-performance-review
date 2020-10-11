import { Roles } from "../roles.enum"
import { ApiProperty } from "@nestjs/swagger"

export class UserDto {
    @ApiProperty({ example: 1 })
    id: number

    @ApiProperty({ example: "david@test.jp" })
    mail: string

    @ApiProperty({ enum: Roles, type: "array", example: [Roles.ADMIN] })
    roles: Roles[]

    @ApiProperty({ example: "David" })
    firstName: string

    @ApiProperty({ example: "Bob" })
    lastName: string

    @ApiProperty({ example: "Development" })
    department: string
}
