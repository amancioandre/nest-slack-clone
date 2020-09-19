import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Room } from 'src/room/room.entity';
import { Space } from 'src/space/space.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectModel(Space.name)
        private readonly spaceModel: Model<Space>,
        @InjectModel(Room.name)
        private readonly roomModel: Model<Room>
    ) {}

    async getChannels(id: string): Promise<Space[]> {
        try {
            const rooms = (await this.roomModel.find({ users: Types.ObjectId(id)} as any).exec())

            console.log(rooms)
            const spaces = await this.spaceModel.find({
                rooms: { "$in": rooms }
            })

            return spaces
        } catch (error) {
            // To do
        }
    }
}
