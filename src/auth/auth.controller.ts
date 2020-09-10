import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpPayloadDTO } from './dto/signup-payload.dto';
import { User } from 'src/user/user.entity';
import { LocalAuthGuard } from './local.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('signup')
    async signUp(@Body() signUpPayloadDTO: SignUpPayloadDTO): Promise<User> {
        return await this.authService.signUp(signUpPayloadDTO)
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req: { user: any }): Promise<any> {
        return await this.authService.login(req.user)
    } 
}
