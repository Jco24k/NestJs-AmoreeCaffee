import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';
import { ValidRoles } from '../interfaces';
import { RoleProtected } from './role-protected.decorator';
import { UserProtected } from './user-protected.decorator';

export function Auth({ user = false, employee = false, roles = [] }) {
  return applyDecorators(

    RoleProtected(...roles),
    UserProtected({ userSearch :user, employeeSerach:employee }),

    UseGuards(AuthGuard(), UserRoleGuard),
  );
}