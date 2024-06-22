import { Body, Controller, Get, Logger, Param, Post, UseGuards } from "@nestjs/common";
import { CarService } from "./car.service";
import { Car } from "./schemas/car.schema";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { CreateCarDto } from "./dtos/create-car.dto";

@Controller('cars')
export class CarController {
    constructor(private readonly carService: CarService) {}

    @Post()
    async publish(@Body() createCarDto: CreateCarDto) {
        return this.carService.create(createCarDto)
    }
}