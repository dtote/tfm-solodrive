import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy} from 'passport-jwt'
import { UserService } from "src/users/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private userService: UserService, private configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        }) 
    }

    async validate(payload: any) {
        // Aqui se puede añadir mas logica
        // return { userId: payload.sub, username: payload.username }

        const user = await this.userService.findById(payload.sub)
        if (!user) {
            throw new UnauthorizedException()
        }
        return user
    }
}