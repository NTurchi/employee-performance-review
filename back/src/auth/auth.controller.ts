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

@Controller()
export class AuthController {
    constructor(
        private readonly authService: AbstractAuthService,
        private readonly userService: AbstractUsersService
    ) {}

    @Post("auth/register")
    @UseGuards(JwtAuthGuard)
    @ForRoles(Roles.ADMIN)
    async register(@Body() registrationData: CreateUserDto) {
        const newUser = await this.authService.register(registrationData)
        delete newUser.password
        const res = { ...newUser, roles: newUser.roles.split(",") }
        return res
    }

    @HttpCode(200)
    @UseGuards(AuthGuard("local"))
    @Post("auth/login")
    async logIn(@Request() request) {
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
    async getAllUsers() {
        return (await this.userService.getAllUsers()).map(u => ({
            ...u,
            password: undefined,
            roles: u.roles.split(",")
        }))
    }

    @Patch("auth/users/:id")
    @UseGuards(JwtAuthGuard)
    @UseGuards(AuthRolesGuard)
    @ForRoles(Roles.ADMIN)
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
