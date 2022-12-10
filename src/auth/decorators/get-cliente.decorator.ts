import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";

export const GetCliente = createParamDecorator(
    (data,ctx: ExecutionContext)=>{ //OBTIENES EL USUARIO GUARDADO DEL REQUEST
        const req = ctx.switchToHttp().getRequest();
        console.log(req);
        const user = req.user;
        if(!user){
            throw new InternalServerErrorException('User not found (request)');
        }
        return !(data) ? user: user[data];
    }
);