import { Injectable } from "@nestjs/common";
import { UnauthorizedException } from "@nestjs/common/exceptions";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Cliente } from "src/clientes/entities/cliente.entity";
import { Repository } from "typeorm";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(Cliente)
        private readonly clienteRepository: Repository<Cliente>,
        configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    async validate(payload: JwtPayload): Promise<Cliente> { 
        const { id } = payload;
        const cliente = await this.clienteRepository.findOneBy({ id });
        if (!cliente) throw new UnauthorizedException('Token not valid');
        if (!cliente.estado) throw new UnauthorizedException('Cliente is inactive, talk with an admin');
        return cliente;
    }
}