import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { User } from "src/user/user.entity";

@Schema()
export class Space extends Document {
    @Prop()
    name: string

    @Prop([User])
    users: User[]
}

export const SpaceSchema = SchemaFactory.createForClass(Space)