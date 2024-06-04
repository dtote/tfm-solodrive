import { Injectable } from '@nestjs/common';
import { CreateAutonomousCarDto } from './dto/create-autonomous-car.dto';
import { UpdateAutonomousCarDto } from './dto/update-autonomous-car.dto';

@Injectable()
export class AutonomousCarService {
  create(createAutonomousCarDto: CreateAutonomousCarDto) {
    return 'This action adds a new autonomousCar';
  }

  findAll() {
    return `This action returns all autonomousCar`;
  }

  findOne(id: number) {
    return `This action returns a #${id} autonomousCar`;
  }

  update(id: number, updateAutonomousCarDto: UpdateAutonomousCarDto) {
    return `This action updates a #${id} autonomousCar`;
  }

  remove(id: number) {
    return `This action removes a #${id} autonomousCar`;
  }
}
