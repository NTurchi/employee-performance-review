import { ApiProperty } from "@nestjs/swagger"

export class LoginResultDto {
    @ApiProperty({ example: "JWT TOKEN" })
    access_token: string
}
