import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from "@nestjs/jwt";
import { User } from 'src/user/user.entity';
import { Model } from 'mongoose';
import { SignUpPayloadDTO } from './dto/signup-payload.dto';
import { LoginPayloadDTO } from './dto/login-payload.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        private readonly jwtService: JwtService) {}

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
}
