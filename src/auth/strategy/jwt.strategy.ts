import { Injectable } from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common/exceptions";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../../User/entities/User.entity";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Role } from "src/roles/entities/role.entity";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    async validate(payload: JwtPayload): Promise<User> {
        const { id } = payload;
        console.log(id)
        const user = await this.userRepository.findOne({
            where: { id },
            relations: {
                roles: true,
                empleado: true
            },
            select: {
                roles: true,
                id: true,
                estado: true,
                empleado: { id: true }
            }
        });
        if (!user) throw new UnauthorizedException('Token not valid');
        if (!user.estado) throw new UnauthorizedException('User is inactive, talk with an admin');
        return {
            ...user,
            roles: user.roles.map(x => ({
                nombre: x.nombre
            }) as Role
            )
        };
    }
}