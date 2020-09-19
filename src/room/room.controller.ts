import { Controller, Put, Param, Req, UseGuards } from '@nestjs/common';
import { Room } from './room.entity';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { RoomService } from './room.service';

@Controller('rooms')
export class RoomController {
    constructor(private readonly roomService: RoomService) {}

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async joinRoom(@Param('id') id: string, @Req() req: { user: any }): Promise<Room> {
        return await this.roomService.joinRoom(id, req.user.id)
    }
}
