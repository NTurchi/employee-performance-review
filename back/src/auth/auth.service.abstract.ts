import { Injectable } from "@nestjs/common"
import { CreateUserDto } from "../users/dto/create-user.dto"
import { User } from "../users/users.model"

export interface IAuthSucceedResult {
    cookie: string
    access_token: string
}

@Injectable()
export abstract class AbstractAuthService {
    abstract login(mail: string, password: string): Promise<User>
    abstract register(newUser: CreateUserDto): Promise<User>
    abstract getCookieWithJwtToken(
        payload: Omit<User, "password">
    ): IAuthSucceedResult
}
