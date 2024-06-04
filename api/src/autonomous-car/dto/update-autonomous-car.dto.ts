import { PartialType } from '@nestjs/mapped-types';
import { CreateAutonomousCarDto } from './create-autonomous-car.dto';

export class UpdateAutonomousCarDto extends PartialType(CreateAutonomousCarDto) {}
