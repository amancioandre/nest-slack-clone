import { Injectable, NotFoundException } from '@nestjs/common';
import { Space } from './space.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSpaceDTO } from './dto/create-space.dto';
import { UpdateSpaceDTO } from './dto/update-space.dto';
import { User } from 'src/user/user.entity';
import { Room } from 'src/room/room.entity';
import { CreateRoomDTO } from './dto/create-room.dto';

@Injectable()
export class SpaceService {
    constructor(
        @InjectModel('Space')
        private readonly spaceModel: Model<Space>,
        @InjectModel('User')
        private readonly userModel: Model<User>,
        @InjectModel('Room')
        private readonly roomModel: Model<Room>
    ) {}

    async findAll(): Promise<Space[]> {
        const spaces = await this.spaceModel.find()
        return spaces
    }

    create(createSpaceDTO: CreateSpaceDTO): Promise<Space> {
        const space = new this.spaceModel(createSpaceDTO)
        const room = new this.roomModel({
            name: "#Welcome"
        })
        space.rooms.push(room)
        return space.save()
    }

    async findOne(id: string): Promise<Space> {
        const space = await this.spaceModel.findById(id).exec()

        if (!space) {
            throw new NotFoundException('Space not found.')
        }

        return space
    }

    async update(id: string, updateSpaceDTO: UpdateSpaceDTO): Promise<Space> {
        const currentSpace = await this.spaceModel.findByIdAndUpdate(
            { _id: id }, { $set: updateSpaceDTO }, { new: true, useFindAndModify: false }
        ).exec()

        if (!currentSpace) {
            throw new NotFoundException('Space not found.')
        }

        return currentSpace
    }

    async remove(id: string): Promise<Space> {
        const space = await this.findOne(id)
        return space.remove()
    }

    async addRoom(id: string, createRoomDTO: CreateRoomDTO): Promise<Space> {
        const space = await this.findOne(id)

        const room = new this.roomModel(createRoomDTO)
        await room.save()

        space.rooms.push(room)
        return space.save()
    }

    async removeRoom(id: string, roomId: string): Promise<Space> {
        const space = await this.findOne(id)

        const room = await this.roomModel.findById(roomId)

        if (!room) {
            throw new NotFoundException('Room not found.')
        }

        const foundRoomIndex = space.rooms.findIndex((roomEl) => roomEl._id = room._id )
        space.rooms.splice(foundRoomIndex, 1)
        await room.remove()
        return space.save()
    }
}
