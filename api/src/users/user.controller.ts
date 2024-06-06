import { Body, Controller, Get, Logger, Param, Post, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./schemas/user.schema";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async findById(@Param('id') id: string): Promise<User> {
        return this.userService.findById(id)
    }
}