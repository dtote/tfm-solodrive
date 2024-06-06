import { IsNotEmpty, IsString } from "class-validator"

export class SignInDto {
    @IsNotEmpty()
    @IsString()
    username: string

    @IsNotEmpty()
    @IsString()
    // @MinLength(8)
    password: string
}