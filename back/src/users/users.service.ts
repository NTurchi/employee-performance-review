import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { User } from "./users.model"
import { AbstractUsersService } from "./users.service.abstract"
import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException
} from "@nestjs/common"
import { CreateUserDto } from "./dto/create-user.dto"
import { UpdateUserDto } from "./dto/update-user.dto"

/**
 * Users service implementation
 *
 * @export
 * @class UsersService
 * @implements {AbstractUsersService}
 */
@Injectable()
export class UsersService implements AbstractUsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>
  ) {}

  getAllUsers(): Promise<User[]> {
    return this.usersRepository.find()
  }

  async create(user: CreateUserDto): Promise<User> {
    const roles = user.roles.join(",")
    const userEntity = await this.usersRepository.create({ ...user, roles })
    return await this.usersRepository.save(userEntity)
  }

  async update(id: number, user: UpdateUserDto): Promise<User> {
    const roles = user.roles.join(",")
    const dbUser = await this.usersRepository.findOne(id)
    if (!dbUser) {
      throw new HttpException("User not found", HttpStatus.NOT_FOUND)
    }

    return await this.usersRepository.save({ ...dbUser, ...user, roles })
  }

  findByMail(mail: string): Promise<User> {
    return this.usersRepository.findOne({ where: { mail } })
  }

  getUserById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne({ id })
  }

  getUserByIds(ids: number[]): Promise<User[]> {
    return this.usersRepository.findByIds(ids)
  }

  async delete(id: number): Promise<any> {
    const user = await this.getUserById(id)
    if (!user) {
      throw new NotFoundException()
    }
    return this.usersRepository.delete({ id })
  }
}
