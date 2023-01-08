import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ForbiddenException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common/exceptions';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { User } from '../../User/entities/User.entity';
import { META_ROLES } from '../decorators/role-protected.decorator';
import { END_POINT_VALIDATE } from '../decorators/user-protected.decorator';
import { ValidFindOne } from '../interfaces/validFindOne.interface';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector
  ) {

  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler());
    const { userSearch, employeeSearch }: ValidFindOne = this.reflector.get(END_POINT_VALIDATE, context.getHandler());
    const listVerificar = [userSearch, employeeSearch]
    if (!validRoles || validRoles.length == 0) return true;
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;
    if (!user) throw new InternalServerErrorException('User not found (request)');
    for (const role of user.roles) if (validRoles.includes(role.nombre)) return true;
    if (listVerificar.some(x => x)) {
      const { id } = req.params
      if (id !== user.id && listVerificar[0]) throw new UnauthorizedException(`User ${user.id} need a valid role: admin`);
      if (id !== user.empleado.id && listVerificar[1]) throw new UnauthorizedException(`Employee ${user.empleado.id} need a valid role: admin`);
      return true
    }
    throw new ForbiddenException(`User ${user.id} need a valid role: ${validRoles}`)
  }
}
