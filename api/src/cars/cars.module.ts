import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Car, CarSchema } from "./schemas/car.schema";
import { CarController } from "./car.controller";
import { CarService } from "./car.service";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";

@Module({
    imports: [
        MulterModule.register({
            storage: diskStorage({
              destination: './uploads',
              filename: (req, file, cb) => {
                cb(null, file.originalname);
              },
            }),
          }),
        MongooseModule.forFeature([{ name: Car.name, schema: CarSchema }]),
    ],
    controllers: [CarController],
    providers: [CarService],
    exports: [CarService]
})
export class CarsModule {}