import { Injectable, NotFoundException } from '@nestjs/common';
import { Space } from './space.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSpaceDTO } from './dto/create-space.dto';
import { UpdateSpaceDTO } from './dto/update-space.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class SpaceService {
    constructor(
        @InjectModel('Space')
        private readonly spaceModel: Model<Space>,
        @InjectModel('User')
        private readonly userModel: Model<User>
    ) {}

    async findAll(): Promise<Space[]> {
        const spaces = await this.spaceModel.find()
        return spaces
    }

    create(createSpaceDTO: CreateSpaceDTO): Promise<Space> {
        const space = new this.spaceModel(createSpaceDTO)
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

    async joinSpace(id: string, userId: string): Promise<Space> {
        const space = await this.findOne(id)
        const user = await this.userModel.findById(userId)

        if (!space) {
            throw new NotFoundException('Space not found.')
        }

        if (!user) {
            throw new NotFoundException('User not found.')
        }

        space.users.push(user)
        return space.save()
    }
}
