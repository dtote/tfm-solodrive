import { Transform } from "class-transformer"
import { IsNotEmpty, IsNumber, IsString, Min } from "class-validator"

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
    @Min(1, { message: 'Car autonomy must be greater than 0' })
    autonomy: number

    @IsNotEmpty()
    @Transform(({ value }) => parseFloat(value))
    @IsNumber()
    price: number

    @IsNotEmpty()
    @IsString()
    owner: string

    @IsNotEmpty()
    @IsString()
    imageUrl: string
}