import { Module } from '@nestjs/common';
import { SpaceService } from './space.service';
import { MongooseModule } from '@nestjs/mongoose';
import { SpaceSchema } from './space.entity';
import { SpaceController } from './space.controller';
import { UserSchema } from 'src/user/user.entity';
import { RoomSchema } from 'src/room/room.entity';

@Module({
  imports: [MongooseModule.forFeature([
      {
        name: 'Space',
        schema: SpaceSchema
      },
      {
        name: 'User',
        schema: UserSchema
      },
      {
        name: 'Room',
        schema: RoomSchema
      }
    ]),
  ],
  providers: [SpaceService],
  controllers: [SpaceController],
  exports: [SpaceService]
})
export class SpaceModule {}
