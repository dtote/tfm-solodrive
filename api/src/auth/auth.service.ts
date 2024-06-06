import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { CreateUserDto } from "src/users/dtos/create-user.dto";
import { UserService } from "src/users/user.service";
import * as bcrypt from 'bcrypt'
import { ConfigService } from "@nestjs/config";
import { UserDocument } from "src/users/schemas/user.schema";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UserService, 
        private jwtService: JwtService
    ) {}

    async signIn(username: string, pass: string) {
        const user = await this.usersService.findOneByUsername(username)
        
        await this.isValidUser(user, pass);
        
        const payload = { username: user.username, sub: user._id }
        return {
            access_token: this.jwtService.sign(payload),
            _id: user._id,
        }
    }

    private async isValidUser(user: UserDocument, pass: string) {
        if (!user) {
            throw new UnauthorizedException();
        }

        const passwordMatches = await bcrypt.compare(pass, user.password);
        if (!passwordMatches) {
            throw new UnauthorizedException();
        }
    }

    async register(createUserDto: CreateUserDto) {
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds)

        const createdUser = await this.usersService.create({ ...createUserDto, password: hashedPassword })
        return this.signIn(createdUser.username, createUserDto.password)
    }
}
