import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class User {
    @Prop({ required: true })
    username: string

    @Prop({ required: true, unique: true })
    dni: string

    @Prop({ required: true })
    password: string

    @Prop()
    wallet: string
}

export type UserDocument = User & Document

export const UserSchema = SchemaFactory.createForClass(User)