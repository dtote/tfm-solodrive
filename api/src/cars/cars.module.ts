import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Car, CarSchema } from "./schemas/car.schema";
import { CarController } from "./car.controller";
import { CarService } from "./car.service";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Car.name, schema: CarSchema }]),
    ],
    controllers: [CarController],
    providers: [CarService],
    exports: [CarService]
})
export class CarsModule {}