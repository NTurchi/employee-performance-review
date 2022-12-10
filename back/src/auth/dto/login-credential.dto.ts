import { ApiProperty } from "@nestjs/swagger"

export class LoginCredentialDto {
  @ApiProperty({ example: "admin" })
  mail: string

  @ApiProperty({ example: "admin" })
  password: string
}
