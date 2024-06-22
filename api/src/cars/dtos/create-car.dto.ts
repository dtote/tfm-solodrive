import { Transform } from "class-transformer"
import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateCarDto {
    @IsNotEmpty()
    @IsString()
    model: string

    @IsNotEmpty()
    @IsString()
    plate: string

    @IsNotEmpty()
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    autonomy: number

    @IsNotEmpty()
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    price: number

    @IsNotEmpty()
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    dailyCharge: number
}