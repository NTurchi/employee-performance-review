import { Strategy } from "passport-jwt"
import { PassportStrategy } from "@nestjs/passport"
import { Injectable } from "@nestjs/common"
import { ExtractJwt } from "passport-jwt"
import { ConfigService } from "@nestjs/config"
import { Request } from "express"

/**
 * JWT strategy
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.Authentication
      ]),
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: configService.get("JWT_ACCESS_SECRET")
    })
  }

  async validate(user) {
    return user
  }
}
