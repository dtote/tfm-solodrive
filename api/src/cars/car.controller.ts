import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { CarService } from "./car.service";
import { CreateCarDto } from "./dtos/create-car.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('cars')
export class CarController {
    constructor(private readonly carService: CarService) {}

    @Post()
    async publish(@Body() createCarDto: CreateCarDto) {
        return this.carService.create(createCarDto)
    }

    @Post('image')
    @UseInterceptors(FileInterceptor('file'))
    async upload(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new HttpException('File not provided', HttpStatus.BAD_REQUEST);
        }
        return { message: 'File uploaded successfully', file };
    }

    @Get('available')
    async getAvailableCars() {
        return this.carService.findAvailableCars()
    }

    @Get('owned/:owner')
    async getOwnerCars(@Param('owner') owner: string) {
        return this.carService.findByOwner(owner)
    }

    @Get(':plate')
    async getCar(@Param('plate') plate: string) {
        return this.carService.findOneByPlate(plate)
    }

    @Patch(':plate')
    async toggleAvailability(@Param('plate') plate: string) {
        return this.carService.toggleAvailability(plate)
    }

    @Delete(':plate')
    async deleteCar(@Param('plate') plate: string, @Query('owner') owner: string) {
        return this.carService.deleteByPlate(plate, owner)
    }
}