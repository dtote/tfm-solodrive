import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator"

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    username: string

    @IsNotEmpty()
    @IsString()
    dni: string

    @IsNotEmpty()
    @IsString()
    password: string

    @IsOptional()
    @IsString()
    wallet: string
}