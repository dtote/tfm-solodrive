import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AutonomousCarService } from './autonomous-car.service';
import { CreateAutonomousCarDto } from './dto/create-autonomous-car.dto';
import { UpdateAutonomousCarDto } from './dto/update-autonomous-car.dto';

@Controller('autonomous-car')
export class AutonomousCarController {
  constructor(private readonly autonomousCarService: AutonomousCarService) {}

  @Post()
  create(@Body() createAutonomousCarDto: CreateAutonomousCarDto) {
    return this.autonomousCarService.create(createAutonomousCarDto);
  }

  @Get()
  findAll() {
    return this.autonomousCarService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.autonomousCarService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAutonomousCarDto: UpdateAutonomousCarDto) {
    return this.autonomousCarService.update(+id, updateAutonomousCarDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.autonomousCarService.remove(+id);
  }
}
