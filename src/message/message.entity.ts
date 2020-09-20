import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes } from "mongoose";
import { User } from "src/user/user.entity";

@Schema()
export class Message extends Document {
    @Prop()
    text: string

    @Prop([{type: SchemaTypes.ObjectId, ref: 'User'}])
    owner: User
}

export const MessageSchema = SchemaFactory.createForClass(Message)