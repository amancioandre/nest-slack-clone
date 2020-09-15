import { Strategy } from "passport-local"
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { User } from "src/user/user.entity";
import { LoginPayloadDTO } from "./dto/login-payload.dto";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor (private readonly authService: AuthService) {
        super()
    }

    async validate(username: string, password: string): Promise<User> {
        const loginPayloadDTO: LoginPayloadDTO = { username, password}
        const user = await this.authService.validateUser(loginPayloadDTO)

        if (!user) {
            throw new UnauthorizedException()
        }

        return user
    }
}