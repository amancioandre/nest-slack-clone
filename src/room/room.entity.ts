import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes } from "mongoose";
import { Message } from "src/message/message.entity";
import { User } from "src/user/user.entity";

@Schema()
export class Room extends Document {
    @Prop()
    name: string

    @Prop([{type: SchemaTypes.ObjectId, ref: 'User'}])
    users: User[]

    @Prop([{type: SchemaTypes.ObjectId, ref: 'Message'}])
    messages: Message[]
}

export const RoomSchema = SchemaFactory.createForClass(Room)