import { BadRequestException, Injectable, Logger, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Car, CarDocument } from "./schemas/car.schema";
import { Model } from "mongoose";
import { CreateCarDto } from "./dtos/create-car.dto";
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CarService {
    constructor(@InjectModel(Car.name) private carModel: Model<CarDocument>) {}

    async create(createCarDto: CreateCarDto): Promise<Car> {
        const existingCar = await this.findOneByPlate(createCarDto.plate)
        if (existingCar) {
            throw new BadRequestException('Car already registered')
        }
        const newCar = new this.carModel(createCarDto)
        return newCar.save()
    }

    async findById(id: string): Promise<Car> {
        return this.carModel.findById(id).exec()
    }

    async findOneByPlate(plate: string): Promise<CarDocument> {
        return this.carModel.findOne({ plate: plate }).exec()
    }

    async findByOwner(owner: string): Promise<Car[]> {
        return this.carModel.find({ owner }).exec()
    }

    async findAvailableCars() : Promise<Car[]> {
        return this.carModel.find({ available: true }).exec()
    }

    async deleteByPlate(plate: string, owner: string) {
        try {
            const car = await this.carModel.findOne({ plate })

            if (!car) {
                throw new NotFoundException()
            }

            if (car.owner !== owner) {
                throw new UnauthorizedException()
            }

            await this.carModel.deleteOne({ plate });
            this.deleteCarImage(plate)

            return { message: 'Car deleted successfully' }
        } catch (error) {
            console.error(`Error deleting car with plate ${plate}:`, error);
            throw error;
        }
    }

    async toggleAvailability(plate: string) {
        const car = await this.findOneByPlate(plate)
        return this.carModel.updateOne({ plate }, { available: !car.available })
    }

    private deleteCarImage(plate: string) {
        const uploadsDir = path.join(__dirname, '../../uploads');

        if (!fs.existsSync(uploadsDir)) {
            throw new Error(`Uploads directory does not exist: ${uploadsDir}`);
        }

        const files = fs.readdirSync(uploadsDir);
        const fileToDelete = files.find(file => file.includes(plate));

        if (fileToDelete) {
            const filePath = path.join(uploadsDir, fileToDelete);
            fs.unlinkSync(filePath);
            console.log(`Image deleted successfully: ${filePath}`);
        }
    }
}
