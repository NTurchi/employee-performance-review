import {
    Body,
    Request,
    Controller,
    HttpCode,
    Post,
    UseGuards,
    Get,
    Patch,
    Param,
    NotFoundException,
    Delete,
    Res,
    HttpStatus
} from "@nestjs/common"
import { Roles } from "../users/roles.enum"
import { AuthGuard } from "@nestjs/passport"

import { AbstractAuthService } from "./auth.service.abstract"
import { JwtAuthGuard } from "./jwt.guard"
import { ForRoles } from "./for-roles.decorator"
import { CreateUserDto } from "../users/dto/create-user.dto"
import { AbstractUsersService } from "../users/users.service.abstract"
import { AuthRolesGuard } from "./auth-roles.guard"
import { UpdateUserDto } from "../users/dto/update-user.dto"
import { Response } from "express"
import { LoginResultDto } from "./dto/login-result.dto"
import { UserDto } from "../users/dto/user.dto"
import { LoginCredentialDto } from "./dto/login-credential.dto"
import {
    ApiBody,
    ApiCookieAuth,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiResponse,
    ApiTags
} from "@nestjs/swagger"

@ApiTags("Authentication & Users management")
@ApiCookieAuth()
@Controller()
export class AuthController {
    constructor(
        private readonly authService: AbstractAuthService,
        private readonly userService: AbstractUsersService
    ) {}

    @Post("auth/register")
    @UseGuards(JwtAuthGuard)
    @ForRoles(Roles.ADMIN)
    @ApiCreatedResponse({
        description: "User created",
        type: UserDto
    })
    async register(@Body() registrationData: CreateUserDto): Promise<UserDto> {
        const newUser = await this.authService.register(registrationData)
        delete newUser.password
        const res = { ...newUser, roles: newUser.roles.split(",") }
        return res as UserDto
    }

    @HttpCode(200)
    @UseGuards(AuthGuard("local"))
    @Post("auth/login")
    @ApiOperation({
        description: "Login into the API"
    })
    @ApiBody({
        description: "Credentials",
        type: LoginCredentialDto
    })
    @ApiCreatedResponse({
        description: "User logged",
        type: LoginResultDto
    })
    async logIn(@Request() request): Promise<LoginResultDto> {
        const { user } = request
        delete user.password
        const { cookie, access_token } = this.authService.getCookieWithJwtToken(
            user
        )
        request.res.setHeader("Set-Cookie", cookie)

        return { access_token }
    }

    @Get("auth/users")
    @UseGuards(JwtAuthGuard)
    @UseGuards(AuthRolesGuard)
    @ForRoles(Roles.ADMIN)
    @ApiOkResponse({
        description: "All users",
        type: UserDto
    })
    async getAllUsers(): Promise<UserDto[]> {
        return (await this.userService.getAllUsers()).map((u) => ({
            ...u,
            password: undefined,
            roles: u.roles.split(",")
        })) as any
    }

    @Patch("auth/users/:id")
    @UseGuards(JwtAuthGuard)
    @UseGuards(AuthRolesGuard)
    @ForRoles(Roles.ADMIN)
    @ApiOkResponse({
        description: "User updated",
        type: UpdateUserDto
    })
    @ApiParam({
        name: "id",
        type: "number"
    })
    async patchUser(@Param("id") id, @Body() updateUserDto: UpdateUserDto) {
        const identifier = parseInt(id)
        if (identifier) {
            return {
                ...{
                    ...(await this.userService.update(id, updateUserDto)),
                    password: undefined
                },
                roles: updateUserDto.roles
            }
        } else {
            throw new NotFoundException()
        }
    }

    @Delete("auth/users/:id")
    @UseGuards(JwtAuthGuard)
    @UseGuards(AuthRolesGuard)
    @ForRoles(Roles.ADMIN)
    @ApiNoContentResponse({
        description: "User deleted"
    })
    @ApiParam({
        name: "id",
        type: "number"
    })
    async deleteUser(@Param("id") id, @Res() res: Response) {
        const identifier = parseInt(id)
        if (identifier) {
            await this.userService.delete(id)
            return res.status(HttpStatus.CREATED).send()
        } else {
            throw new NotFoundException()
        }
    }
}
