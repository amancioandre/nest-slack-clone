import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/user.entity';
import { Model } from 'mongoose';
import { SignUpPayloadDTO } from './dto/signup-payload.dto';

@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}

    async signUp(signUpPayloadDTO: SignUpPayloadDTO): Promise<User> {
        const user = new this.userModel(signUpPayloadDTO)

        return await user.save()
    }
}
