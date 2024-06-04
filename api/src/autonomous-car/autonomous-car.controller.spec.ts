import { Test, TestingModule } from '@nestjs/testing';
import { AutonomousCarController } from './autonomous-car.controller';
import { AutonomousCarService } from './autonomous-car.service';

describe('AutonomousCarController', () => {
  let controller: AutonomousCarController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AutonomousCarController],
      providers: [AutonomousCarService],
    }).compile();

    controller = module.get<AutonomousCarController>(AutonomousCarController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
