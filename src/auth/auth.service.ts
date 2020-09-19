import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from "@nestjs/jwt";
import { User } from 'src/user/user.entity';
import { Model } from 'mongoose';
import { SignUpPayloadDTO } from './dto/signup-payload.dto';
import { LoginPayloadDTO } from './dto/login-payload.dto';
import { AccessTokenValidateDTO } from './dto/access-token-validate.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        private readonly jwtService: JwtService
    ) {}

    signUp(signUpPayloadDTO: SignUpPayloadDTO): Promise<User> {
        const user = new this.userModel(signUpPayloadDTO)
        return user.save()
    }

    async login(user: User): Promise<any> {
        const payload = { username: user.username, sub: user._id }
        return {
            accessToken: this.jwtService.sign(payload)
        }
    }

    async validateUser(loginPayloadDTO: LoginPayloadDTO): Promise<User | null> {
        const { username, password } = loginPayloadDTO
        const user = await this.userModel.findOne({ username }).exec()

        if (user && user.password === password) {
            return user
        }

        return null
    }
    
    async validateFromToken(token: string): Promise<User | null> {
        const decoded: AccessTokenValidateDTO =  this.jwtService.verify(token)
        const user = await this.userModel.findById(decoded?.sub)

        if (!user) {
            return null
        }

        return user
    }
}
