import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';
import { RoleProtected } from './role-protected.decorator';
import { UserProtected } from './user-protected.decorator';
import { ValidFindOne } from '../interfaces/validFindOne.interface';

export function Auth({ user = false, employee = false, roles = [] }) {
  return applyDecorators(

    RoleProtected(...roles),
    UserProtected({ userSearch :user, employeeSearch:employee } as ValidFindOne),

    UseGuards(AuthGuard(), UserRoleGuard),
  );
}