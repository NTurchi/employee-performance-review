import { createParamDecorator, ExecutionContext } from "@nestjs/common"

export const BearerToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return request?.cookies?.Authentication
  }
)
