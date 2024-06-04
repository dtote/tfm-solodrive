import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<User>

@Schema()
export class User {
    @Prop({ type: String, required: true })
    name: string
    
    @Prop({ type: String, required: true })
    dni: string
    
    @Prop({ type: String, required: true })
    email: string
    
    @Prop({ type: String, required: true })
    password: string
    
    @Prop({ type: String, required: true })
    wallet: string
}

export const UserSchema = SchemaFactory.createForClass(User)