import {
    HttpException,
    HttpStatus,
    Injectable,
    OnModuleInit
} from "@nestjs/common"
import { AbstractUsersService } from "../users/users.service.abstract"
import * as bcrypt from "bcrypt"
import { User } from "../users/users.model"
import { CreateUserDto } from "../users/dto/create-user.dto"
import {
    AbstractAuthService,
    IAuthSucceedResult
} from "./auth.service.abstract"
import { JwtService } from "@nestjs/jwt"
import { ConfigService } from "@nestjs/config"
import { Roles } from "src/users/roles.enum"

/**
 * simple authentication service
 *
 * @export
 * @class AuthService
 */
@Injectable()
export class AuthService implements AbstractAuthService, OnModuleInit {
    constructor(
        private usersService: AbstractUsersService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async onModuleInit() {
        if ((await this.usersService.getAllUsers()).length === 0) {
            // save admin
            await this.register({
                password: "admin",
                mail: "admin",
                firstName: "admin",
                lastName: "admin",
                roles: [Roles.EMPLOYEE, Roles.ADMIN],
                department: "Administrator"
            })
        }
    }

    /**
     * Check user credential for accessing the API
     *
     * @param {string} mail
     * @param {string} password
     * @returns {Promise<User>}
     * @memberof AuthService
     */
    async login(mail: string, password: string): Promise<User> {
        const user = await this.usersService.findByMail(mail)

        const passwordMatched =
            user && (await bcrypt.compare(password, user.password))

        if (!passwordMatched) {
            throw new HttpException(
                "Invalid credentials",
                HttpStatus.BAD_REQUEST
            )
        }
        delete user.password
        return user
    }

    /**
     * Register a new user
     *
     * @param {CreateUserDto} newUser
     * @returns
     * @memberof AuthService
     */
    public async register(newUser: CreateUserDto): Promise<User> {
        const hashedPassword = await bcrypt.hash(newUser.password, 10)
        const userWithTheSameMail = await this.usersService.findByMail(
            newUser.mail
        )
        if (userWithTheSameMail) {
            throw new HttpException(
                "Email already exists",
                HttpStatus.BAD_REQUEST
            )
        }
        try {
            const createdUser = await this.usersService.create({
                ...newUser,
                password: hashedPassword
            })
            return createdUser
        } catch (error) {
            throw new HttpException(
                "Internal Server Error",
                HttpStatus.INTERNAL_SERVER_ERROR
            )
        }
    }

    public getCookieWithJwtToken(
        payload: Omit<User, "password">
    ): IAuthSucceedResult {
        const access_token = this.jwtService.sign({
            ...payload,
            roles: payload.roles.split(",")
        })
        const cookie = `Authentication=${access_token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
            "JWT_ACCESS_EXPIRATION"
        )}`
        return {
            cookie,
            access_token
        }
    }
}
