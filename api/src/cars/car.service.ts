import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Car, CarDocument } from "./schemas/car.schema";
import { Model } from "mongoose";
import { CreateCarDto } from "./dtos/create-car.dto";

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
        return this.carModel.findOne({ dni: plate }).exec()
    }

    async findByOwner(owner: string): Promise<Car[]> {
        return this.carModel.find({ owner }).exec()
    }
}
