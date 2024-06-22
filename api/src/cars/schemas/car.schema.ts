import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Car {
    @Prop({ required: true })
    model: string

    @Prop({ required: true, unique: true })
    plate: string

    @Prop({ required: true })
    autonomy: number

    @Prop({ required: true })
    price: number

    @Prop({ required: true })
    dailyCharge: number

    @Prop()
    owner: string

    @Prop({ default: true })
    available: boolean
}

export type CarDocument = Car & Document

export const CarSchema = SchemaFactory.createForClass(Car)