import { User } from "./users.model"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"

/**
 * Abstract class of users service. For IOC
 *
 * @export
 * @abstract
 * @class UsersService
 */
export abstract class AbstractUsersService {
    abstract getAllUsers(): Promise<User[]>
    abstract findByMail(mail: string): Promise<User | undefined>
    abstract create(user: CreateUserDto): Promise<User>
    abstract getUserById(id: number): Promise<User | undefined>
    abstract getUserByIds(ids: number[]): Promise<User[]>
    abstract update(id: number, user: UpdateUserDto): Promise<User>
    abstract delete(id: number): Promise<any>
}
