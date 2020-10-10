import { Module, Provider } from "@nestjs/common"
import { UsersService } from "./users.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from "./users.model"
import { AbstractUsersService } from "./users.service.abstract"

const usersServiceProviders: Provider<AbstractUsersService> = {
    useClass: UsersService,
    provide: AbstractUsersService
}

@Module({
    providers: [usersServiceProviders],
    imports: [TypeOrmModule.forFeature([User])],
    exports: [usersServiceProviders]
})
export class UsersModule {}
