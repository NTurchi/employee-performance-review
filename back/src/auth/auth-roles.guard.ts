import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import { JwtService } from "@nestjs/jwt"
import { Request } from "express"
import { User } from "../users/users.model"

@Injectable()
export class AuthRolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private jwtService: JwtService) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>(
            "roles",
            context.getHandler()
        )
        if (!roles) {
            return true
        }
        const request: Request = context.switchToHttp().getRequest()
        // check user info
        if (request.cookies && request.cookies.Authentication) {
            const user: User = this.jwtService.decode(
                request.cookies.Authentication
            ) as User
            if (user.roles) {
                return roles.reduce(
                    (includeRole, role) =>
                        includeRole ? includeRole : user.roles.includes(role),
                    false
                )
            }
        }

        return false
    }
}
