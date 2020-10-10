import { ValidationPipe } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import * as cookieParser from "cookie-parser"

async function bootstrap() {
    const app = await NestFactory.create(AppModule)
    app.setGlobalPrefix("/v1/api")
    app.use(cookieParser())
    app.useGlobalPipes(new ValidationPipe())
    app.enableCors({ origin: "http://localhost:3000", credentials: true })
    const configService = app.get(ConfigService)
    await app.listen(configService.get<number>("PORT") || 2020)
}
bootstrap()
