import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(private userService: UserService) {}

    async signin(username: string, pass: string) {
        const user = await this.userService.findOneByUsername(username)

        if (user.password !== pass) {
            throw new UnauthorizedException()
        }

        const { password, ...result } = user

        // TODO: Generate a JWT and return it here instead
        // of the user object
        return result
    }
}
