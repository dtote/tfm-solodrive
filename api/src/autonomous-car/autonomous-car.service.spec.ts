import { Test, TestingModule } from '@nestjs/testing';
import { AutonomousCarService } from './autonomous-car.service';

describe('AutonomousCarService', () => {
  let service: AutonomousCarService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AutonomousCarService],
    }).compile();

    service = module.get<AutonomousCarService>(AutonomousCarService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
