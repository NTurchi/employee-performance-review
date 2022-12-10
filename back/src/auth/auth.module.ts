import { Global, Module, Provider } from "@nestjs/common"
import { AuthService } from "./auth.service"

import { LocalStrategy } from "./local.strategy"
import { UsersModule } from "../users/users.module"
import { AbstractAuthService } from "./auth.service.abstract"
import { AuthController } from "./auth.controller"
import { PassportModule } from "@nestjs/passport"
import { JwtModule } from "@nestjs/jwt"
import { JwtStrategy } from "./jwt.strategy"
import { ConfigService } from "@nestjs/config"

const authServiceProvider: Provider<AuthService> = {
  useClass: AuthService,
  provide: AbstractAuthService
}

@Global()
@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get("JWT_ACCESS_SECRET"),
        signOptions: {
          expiresIn: configService.get("JWT_ACCESS_EXPIRATION")
        }
      }),
      inject: [ConfigService]
    })
  ],
  providers: [LocalStrategy, authServiceProvider, JwtStrategy],
  exports: [authServiceProvider, LocalStrategy, JwtStrategy, JwtModule],
  controllers: [AuthController]
})
export class AuthModule {}
