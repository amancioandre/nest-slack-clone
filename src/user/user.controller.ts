import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Space } from 'src/space/space.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get("me/channels")
    async getChannels(@Req() req: { user: any }): Promise<Space[]> {
        return await this.userService.getChannels(req.user.id)
    }
}
