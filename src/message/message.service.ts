import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MessageDTO } from './dto/message.dto';
import { Message } from './message.entity';

@Injectable()
export class MessageService {
    constructor(
        @InjectModel(Message.name)
        private readonly messageModel: Model<Message>
    ) {}

    async find(): Promise<Message[]> {
        const messages = await this.messageModel.find().exec()
        return messages
    }

    async create(messageDTO: MessageDTO): Promise<Message> {
        const message = new this.messageModel(messageDTO)
        await message.save()
        return message
    }
}
