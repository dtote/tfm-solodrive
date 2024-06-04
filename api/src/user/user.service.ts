import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {

  constructor(@InjectModel(User.name) private readonly userModel: Model<User>) {}
  
  async create(createUserDto: CreateUserDto) {
    const createdUser = await this.userModel.create(createUserDto)

    return createdUser
  }

  findAll() {
    return this.userModel.find().exec();
  }

  findOne(id: string) {
    return this.userModel.find({ _id: id })
  }

  async findOneByUsername(username: string) : Promise<User | undefined> {
    return this.userModel.findOne({ name: username })
  }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
