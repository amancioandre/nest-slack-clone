import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoomSchema } from './room.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'Room',
                schema: RoomSchema
            }
        ])
    ]
})
export class RoomModule {}
