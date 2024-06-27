import { HttpException, HttpStatus, Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Car, CarSchema } from "./schemas/car.schema";
import { CarController } from "./car.controller";
import { CarService } from "./car.service";
import { MulterModule } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { existsSync } from "fs";

@Module({
    imports: [
        MulterModule.register({
            storage: diskStorage({
              destination: './uploads',
              filename: (req, file, cb) => {
                const filePath = `./uploads/${file.originalname}`;
                if (existsSync(filePath)) {
                  return cb(
                    new HttpException('Car already registered', HttpStatus.CONFLICT),
                    null
                  );
                }
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