import { SetMetadata } from "@nestjs/common"
import { Roles } from "../users/roles.enum"

export const ForRoles = (...roles: Roles[]) => SetMetadata("roles", roles)
