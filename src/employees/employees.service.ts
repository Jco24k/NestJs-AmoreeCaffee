import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, forwardRef } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';
import { FindOptionsOrder, FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { validate as isUUID } from 'uuid';
import { UserService } from 'src/user/user.service';

@Injectable()
export class EmployeesService {

  private defaultLimit: number;

  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly configService: ConfigService,

  ) {
    this.defaultLimit = this.configService.get<number>('defaultlimit');
  }


  async create(createEmployeeDto: CreateEmployeeDto) {
    try {
      const emp = this.employeeRepository.create(createEmployeeDto);
      return await this.employeeRepository.save(emp);
    } catch (error) {
      this.handleException(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0, orderby = 'id', sordir = 'asc', estado = 'all' } = paginationDto;
    const condition: FindOptionsWhere<Employee> = (estado === 'all' ? {} : JSON.parse(`{"estado": "${(estado === 'active' ? true : false)}" }`))
    const orderBy: FindOptionsOrder<Employee> = JSON.parse(`{"${orderby}": "${sordir}" }`)

    return await this.employeeRepository.find({
      take: limit,
      skip: offset,
      order: orderBy,
      where: condition
    })
  }

  async findOne(id: string) {
    let employee: Employee;
    if (isUUID(id)) {
      employee = await this.employeeRepository.findOneBy({ id: id });
    }
    if (!employee) throw new NotFoundException(`Employee with id or dni ${id} not found`);
    return employee;
  }


  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    if (updateEmployeeDto.id) updateEmployeeDto.id = id;
    const employee = await this.findOne(id);
    try {
      await this.employeeRepository.update({ id }, { ...updateEmployeeDto });
      return { ...employee, ...updateEmployeeDto };
    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    const user = await this.userService.findUserOrRolesActive(id,'empleado')
    if (user) throw new InternalServerErrorException(`The Employee with id ${id} cannot be deleted because it is in use.`)
    await this.employeeRepository.update({ id }, { estado: false });
    return { message: `Employee with id ${id} deleted successfully` };

  }

  private handleException(error: any) {

    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

}
