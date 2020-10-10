import { Test, TestingModule } from "@nestjs/testing"
import { AbstractUsersService, User, CreateUserDto, Roles } from "../users"
import { AuthService } from "./auth.service"
import * as bcrypt from "bcrypt"
import { HttpException } from "@nestjs/common"

describe("AuthService", () => {
    let service: AuthService
    let existingUser = {
        id: 2,
        password: "Test",
        firstName: "First Name",
        lastName: "Last Name",
        department: "Dpt",
        roles: "ADMIN",
        mail: "existing@mail.com"
    }
    // FACK DB
    let existingUsers: User[] = [existingUser as any]
    // USER SERVICE MOCK
    let userServiceMock: AbstractUsersService = {
        create: jest.fn(user => {
            const roles = user.roles.join(",")
            const createUserDto = { ...user, roles, id: 1 }
            return Promise.resolve(createUserDto) as any
        }),
        findByMail: jest.fn(mail =>
            Promise.resolve(existingUsers.find(u => u.mail === mail))
        ),
        getAllUsers: jest.fn()
    }
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    useValue: userServiceMock,
                    provide: AbstractUsersService
                }
            ]
        }).compile()

        service = module.get<AuthService>(AuthService)
    })

    it("should be defined", () => {
        expect(service).toBeDefined()
    })

    it("should register a new user and hash the password", async () => {
        const newUser: CreateUserDto = {
            ...existingUser,
            roles: [Roles.ADMIN],
            mail: "newmail@test.fr",
            password: "myNewPassword"
        }
        const user = await service.register(newUser)

        const passwordIsHashed = await bcrypt.compare(
            "myNewPassword",
            user.password
        )

        expect(user).toBeDefined()
        expect(passwordIsHashed).toBeTruthy()
        expect(
            ["mail", "firstName", "lastName", "department"].reduce(
                (isCorresponding, propsKey) =>
                    isCorresponding
                        ? newUser[propsKey] === user[propsKey]
                        : false,
                true
            )
        ).toBeTruthy()
    })

    it("should throw an error if the mail already exist", async () => {
        const newUser: CreateUserDto = {
            ...existingUser,
            roles: [Roles.EMPLOYEE],
            mail: existingUser.mail,
            password: "anyhingIsFine"
        }

        try {
            await service.register(newUser)
        } catch (e) {
            expect(e instanceof HttpException).toBeTruthy()
        }
    })
})
