import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomSchema } from './room.entity';
import { RoomService } from './room.service';
import { UserSchema } from 'src/user/user.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'Room',
                schema: RoomSchema
            },
            {
                name: 'User',
                schema: UserSchema
            }
        ])
    ],
    providers: [RoomService]
})
export class RoomModule {}
