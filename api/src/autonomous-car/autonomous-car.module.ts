import { Module } from '@nestjs/common';
import { AutonomousCarService } from './autonomous-car.service';
import { AutonomousCarController } from './autonomous-car.controller';

@Module({
  controllers: [AutonomousCarController],
  providers: [AutonomousCarService],
})
export class AutonomousCarModule {}
