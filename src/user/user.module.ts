import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Space, SpaceSchema } from 'src/space/space.entity';
import { Room, RoomSchema } from 'src/room/room.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: User.name,
                schema: UserSchema
            },
            {
                name: Space.name,
                schema: SpaceSchema
            },
            {
                name: Room.name,
                schema: RoomSchema
            }
        ]),
    ],
    providers: [UserService],
    exports: [],
    controllers: [UserController]
})
export class UserModule {}
