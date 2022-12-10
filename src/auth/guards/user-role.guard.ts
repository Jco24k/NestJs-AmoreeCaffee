import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ForbiddenException, InternalServerErrorException } from '@nestjs/common/exceptions';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators/role-protected.decorator';

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
    if(!validRoles || validRoles.length == 0) return true;
    const req = context.switchToHttp().getRequest();
    return true;
  }
}
