import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document, SchemaTypes } from "mongoose";
import { Room } from "src/room/room.entity";

@Schema()
export class Space extends Document {
    @Prop()
    name: string

    @Prop([{type: [SchemaTypes.ObjectId], ref: 'Room'}])
    rooms: Room[]
}

export const SpaceSchema = SchemaFactory.createForClass(Space)