import { Strategy } from "passport-local"
import { PassportStrategy } from "@nestjs/passport"
import { Injectable } from "@nestjs/common"
import { User } from "../users/users.model"
import { AbstractAuthService } from "./auth.service.abstract"

/**
 * NodeJS Passport strategy
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AbstractAuthService) {
        super({
            usernameField: "mail"
        })
    }
    async validate(mail: string, password: string): Promise<User> {
        return await this.authService.login(mail, password)
    }
}
