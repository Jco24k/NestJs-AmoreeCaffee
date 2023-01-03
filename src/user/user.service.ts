import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { BadRequestException, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common/exceptions';
import { ConfigService } from '@nestjs/config';
import { PaginationDto } from '../common/dto/pagination.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { Role } from '../roles/entities/role.entity';
import { Employee } from '../employees/entities/employee.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmployeesService } from '../employees/employees.service';
import { AuthService } from '../auth/auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { RolesService } from 'src/roles/roles.service';
import { validate as isUUID } from 'uuid';

@Injectable()
export class UserService {

  private defaultLimit: number;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => EmployeesService))
    private readonly employeeService: EmployeesService,
    @Inject(forwardRef(() => RolesService))
    private readonly roleService: RolesService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService


  ) {
    this.defaultLimit = this.configService.get<number>('defaultlimit');
  }

  async create(createUserDto: CreateUserDto) {
    await this.findForeignKey(createUserDto);
    const { password, roles, ...userData } = createUserDto

    const user = this.userRepository.create({
      ...userData,
      roles,
      password: bcrypt.hashSync(password, 10)
    });
    const userCreate = await this.userRepository.save(user);
    return {
      ...userCreate,
      token: this.authService.getJwtToken({ id: userCreate.id })
    };

  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0, orderby = 'id', sordir = 'asc', estado = 'all' } = paginationDto;
    const condition: FindOptionsWhere<User> = (estado === 'all' ? {} : JSON.parse(`{"estado": "${(estado === 'active' ? true : false)}" }`))
    const orderBy: FindOptionsOrder<User> = JSON.parse(`{"${orderby}": "${sordir}" }`)

    return await this.userRepository.find({
      take: limit,
      skip: offset,
      order: orderBy,
      relations: {
        roles: true,
        empleado: true
      },
      where: condition

    })
  }

  async findOne(search: string) {
    var user: User;
    if (isUUID(search)) {
      user = await this.userRepository.findOne({ where: { id: search }, relations: { roles: true } });
    }
    if (!user) throw new NotFoundException(`User with id '${search}' not found`);
    return user;
  }


  async update(id: string, updateUserDto: UpdateUserDto) {
    const { roles, ...details } = updateUserDto
    const user = await this.findOne(id);
    await this.findForeignKey(updateUserDto)
    if (updateUserDto.password) updateUserDto.password = bcrypt.hashSync(updateUserDto.password, 10)
    if (roles) {
      user.roles = roles
    }
    await this.userRepository.save({ ...user, ...details });
    return await this.findOne(id);

  }

  async remove(id: string) {
    await this.findOne(id);
    await this.userRepository.update({ id }, { estado: false });
    return { message: `User with id ${id} deleted successfully` };

  }

  async findForeignKey(userDto: CreateUserDto | UpdateUserDto) {
    if (userDto.roles) {
      const idRolDto = userDto.roles.map(x => x.id);
      const roles = await this.roleService.findIdsRoles(idRolDto)
      roles.forEach(rol => {
        if (!rol.estado) throw new BadRequestException(`User  with role id '${rol.id}' is inactive`)
      });
      const idsRoles = roles.map(x => x.id)
      const compareList = (a: string[], b: string[]) => a.length === b.length && a.every((x: string, index: number) => x === b[index])
      if (!compareList(idRolDto, idsRoles)) throw new NotFoundException(`User with Roles{'id'} [${idRolDto}] not found`);
    }
    if (userDto.empleado) {
      const emp = await this.employeeService.findOne(userDto.empleado.id);
      if (!emp.estado) throw new BadRequestException(`User  with empleado id '${emp.id}' is inactive`)

    }
  }


  async findUserOrRolesActive(id: string, option: string) {
    const condition: FindOptionsWhere<User> = JSON.parse(`{"${option}": { "id":"${id}"},"estado": true }`)
    return await this.userRepository.findOne({
      where: condition
    });
  }

}
