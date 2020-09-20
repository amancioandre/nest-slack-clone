import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Room } from './room.entity';
import { User } from 'src/user/user.entity';

@Injectable()
export class RoomService {
    constructor(
        @InjectModel('Room')
        private readonly roomModel: Model<Room>,
        @InjectModel('User')
        private readonly userModel: Model<User>
    ) {}

    async findOne(id: string): Promise<Room> {
        const room = await this.roomModel.findById(id).populate({
            path: "messages",
            populate: {
                path: "owner",
                select: "name username"
            }
        })

        if (!room) {
            throw new NotFoundException('Room not found.')
        }

        return room
    }

    async joinRoom(id: string, userId: string): Promise<Room> {
        const room = await this.findOne(id)

        const user = await this.userModel.findById(userId)

        if (!user) {
            throw new NotFoundException('User not found.')
        }
        
        room.users.push(user)
        return room.save()
    }
    
}
