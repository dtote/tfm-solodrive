import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { Model } from "mongoose";
import { CreateUserDto } from "./dtos/create-user.dto";

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const existingUser = await this.findOneByDni(createUserDto.dni)
        if (existingUser) {
            throw new BadRequestException('User already registered')
        }
        const newUser = new this.userModel(createUserDto)
        return newUser.save()
    }

    async findById(id: string): Promise<User> {
        return this.userModel.findById(id).exec()
    }

    async findOneByUsername(username: string): Promise<UserDocument> {
        return this.userModel.findOne({ username }).exec()
    }

    async findOneByDni(dni: string): Promise<UserDocument> {
        return this.userModel.findOne({ dni }).exec()
    }
}
