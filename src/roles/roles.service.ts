import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException, forwardRef } from '@nestjs/common';
import { User } from '../User/entities/User.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsOrder, FindOptionsWhere, In, Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';
import { UserService } from 'src/user/user.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RolesService {
  private defaultLimit: number;

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {

    this.defaultLimit = this.configService.get<number>('defaultlimit');
  }
  async create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepository.create(createRoleDto);
    return await this.roleRepository.save(role);

  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = this.defaultLimit, offset = 0, orderby = 'id', sordir = 'asc', estado = 'all' } = paginationDto;
    const condition: FindOptionsWhere<Role> = (estado === 'all' ? {} : { estado: (estado === 'active' ? true : false) })
    const orderBy: FindOptionsOrder<Role> = JSON.parse(`{"${orderby}": "${sordir}" }`)

    return await this.roleRepository.find({
      take: limit,
      skip: offset,
      order: orderBy,
      where: condition
    })

  }

  async findOne(search: string) {
    let rol: Role;
    if (isUUID(search)) {
      rol = await this.roleRepository.findOneBy({ id: search });
    } else {
      rol = await this.roleRepository.findOne({ where: { nombre: search.toLowerCase().trim() } });
    }
    if (!rol) throw new NotFoundException(`Role with id or name ${search} not found`);
    return rol;
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    if (updateRoleDto.id) updateRoleDto.id = id;
    const rol = await this.findOne(id);
    await this.roleRepository.update({ id }, { ...updateRoleDto });
    return { ...rol, ...updateRoleDto };

  }

  async remove(id: string) {
    await this.findOne(id);
    const user = await this.userService.findUserOrRolesActive(id, 'roles')
    if (user) throw new InternalServerErrorException(`The role with id ${id} cannot be deleted because it is in use.`)
    await this.roleRepository.update({ id }, { estado: false });
    return { message: `Role with id ${id} deleted successfully` };
  }


  async findIdsRoles(idRoles: string[]) {
    return await this.roleRepository.find({
      where: {
        id: In(idRoles)
      }
    })
  }
}
