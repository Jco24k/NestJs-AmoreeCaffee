import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CabeceraPedido } from 'src/cabecera-pedido/entities/cabecera-pedido.entity';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Comprobante } from 'src/comprobante/entities/comprobante.entity';
import { DetallePedido } from 'src/detalle-pedido/entities/detalle-pedido.entity';
import { Mesa } from 'src/mesa/entities/mesa.entity';
import { Producto } from 'src/productos/entities/producto.entity';
import { DataSource, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { UserSeed } from './dto/email-seed.dto';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import * as format from 'pg-format';
import { SeedFormatSql } from './interfaces/seed-format.interface';
import { ProductoImage } from 'src/productos/entities/producto-image.entity';
import { CategoriaImage } from 'src/categorias/entities/categoria-image.entity';
import { Employee } from 'src/employees/entities/employee.entity';
import { Role } from 'src/roles/entities/role.entity';
import { User } from 'src/User/entities/User.entity';

@Injectable()
export class SeedService {

  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Mesa)
    private readonly mesaRepository: Repository<Mesa>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    @InjectRepository(CategoriaImage)
    private readonly categoriaImageRepository: Repository<CategoriaImage>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(ProductoImage)
    private readonly productoImageRepository: Repository<ProductoImage>,
    @InjectRepository(CabeceraPedido)
    private readonly cabPedidoRepository: Repository<CabeceraPedido>,
    @InjectRepository(DetallePedido)
    private readonly detPedidoRepository: Repository<DetallePedido>,
    @InjectRepository(Comprobante)
    private readonly comprobanteRepository: Repository<Comprobante>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) { }

  async seedExecute(userSeed: UserSeed) {
    const registerCant = { clientes: 10_000, empleados: 10_000, categorias: 10_000, mesas: 10_000, productos: 10_000, cabeceraPedido: 10_000, cantidadDetalle: 2 }
    const userValid: UserSeed = { username: this.configService.get<string>("USERNAME_SEED"), password: this.configService.get<string>("PASSWORD_SEED") };
    if (userSeed.username !== userValid.username || userSeed.password !== userValid.password) throw new UnauthorizedException('Credentials are not valid');
    console.time("ELIMINACION");
    await this.deleteTables();
    console.timeEnd("ELIMINACION");
    try {
      console.time("inicio tablas primarias : " + registerCant.clientes);
      await Promise.allSettled([this.insertClientes(registerCant.clientes), this.insertMesas(registerCant.mesas),
      this.insertEmployees(registerCant.empleados), this.inserRoles()])
      console.timeEnd("inicio tablas primarias : " + registerCant.clientes);
      console.time("inicio empleados : " + registerCant.empleados);
      await this.insertUsers(registerCant.empleados, userSeed)
      console.timeEnd("inicio empleados : " + registerCant.empleados);

      await this.dataSource.query(
        format(
          SeedFormatSql.categories,
          Array.from(
            new Array(registerCant.categorias),
            (value, index) => [(faker.commerce.department() + index).toLowerCase(), true]
          )
        )
      );
      const categories = await this.categoriaRepository.find()
      await this.dataSource.query(
        format(
          SeedFormatSql.categories_images,
          Array.from(
            new Array(registerCant.categorias),
            (value, index) => [
              faker.image.abstract(640, 480, true),
              true,
              categories.at(index).id
            ]
          )
        )
      );

      console.time("inicio Creacion Productos : " + registerCant.productos);
      await this.dataSource.query(
        format(
          SeedFormatSql.products,
          Array.from(
            new Array(registerCant.productos),
            (value, index) => [
              (faker.commerce.product() + index).toLowerCase(),
              faker.commerce.productDescription().toLowerCase(),
              +faker.datatype.number({ min: 10, max: 500, precision: 0.01 }),
              +faker.datatype.number({ min: 1, max: 200 }),
              categories.at(Math.floor(Math.random() * categories.length)).id
            ]
          )
        )
      );

      const productos = await this.productoRepository.find()
      await this.dataSource.query(
        format(
          SeedFormatSql.productsImages,
          Array.from(
            new Array(registerCant.productos),
            (value, index) => [
              faker.image.food(640, 480, true),
              true,
              productos.at(index).id
            ]
          )
        )
      );
      console.timeEnd("inicio Creacion Productos : " + registerCant.productos);

      console.time("inicio Creacion Pedido : " + registerCant.productos);
      const mesaList = await this.mesaRepository.find();
      const clienteList = await this.clienteRepository.find();

      const cab = new Array(registerCant.cabeceraPedido)
        .fill(null)
        .map(() => faker.datatype.uuid());

      const detallePedido = Array.from(
        new Array(registerCant.cabeceraPedido),
        (value, indice) => {
          let detailsPro = new Array(registerCant.cantidadDetalle)
            .fill(null)
            .map((value, index) => {
              const cantidad = Math.floor(Math.random() * 10 + 1);
              const { precio, id } = productos.at(index)
              return [cab.at(indice), id, precio, cantidad, +(precio * cantidad).toFixed(2)]
            })
          return detailsPro
        }
      ).flat();

      const cabeceraPedido = cab.reduce(
        (total, id) => {
          let clientIndex = Math.floor(Math.random() * clienteList.length);
          let tableIndex = Math.floor(Math.random() * mesaList.length);
          const tot = detallePedido.reduce(
            (total, x) => id !== x[0] ? total : total + (+x[3]), 0
          )
          total.push([
            id, clienteList.at(clientIndex).id, mesaList.at(tableIndex).id,
            +tot.toFixed(2), true, clienteList.at(clientIndex).nombre
          ])
          return total;
        }, [])

      await this.dataSource.query(format(SeedFormatSql.orderHeader, cabeceraPedido));
      await this.dataSource.query(format(SeedFormatSql.orderDetail, detallePedido));
      await this.dataSource.query(format(SeedFormatSql.voucher, Array.from(
        new Array(registerCant.cabeceraPedido),
        (value, index) => [
          faker.datatype.number({ min: 10_000_000_000, max: 99_999_999_999 }),
          cabeceraPedido.at(index)[0]
        ]
      )))
      console.timeEnd("inicio Creacion Pedido : " + registerCant.productos);
      return {
        clientes: `${registerCant.clientes} inserts`,
        empleados: `${registerCant.empleados} inserts`,
        usuarios: `${registerCant.empleados} inserts`,
        categorias: `${registerCant.categorias} inserts`,
        categoria_images: `${registerCant.categorias} inserts`,
        mesas: `${registerCant.mesas} inserts`,
        productos: `${registerCant.productos} inserts`,
        producto_images: `${registerCant.productos} inserts`,
        cabeceraPedidos: `${registerCant.cabeceraPedido} inserts`,
        detallePedidos: `${registerCant.cantidadDetalle * registerCant.cabeceraPedido} inserts`,
        comprobantes: `${registerCant.cabeceraPedido} inserts`
      };
    } catch (error) {
      await this.deleteTables()
      return error;
    }


  }


  private async deleteTables() {
    await this.comprobanteRepository.delete({})
    await this.detPedidoRepository.delete({})
    await this.cabPedidoRepository.delete({})
    await this.productoImageRepository.delete({});
    await this.productoRepository.delete({});
    await this.categoriaImageRepository.delete({});
    await this.categoriaRepository.delete({})
    await this.clienteRepository.delete({})
    await this.userRepository.delete({})
    await this.roleRepository.delete({})
    await this.employeeRepository.delete({})
    await this.mesaRepository.delete({})
  }

  private async insertClientes(cant: number) {
    const password = bcrypt.hashSync(`fghij56789`, 10);
    await this.dataSource.query(
      format(
        SeedFormatSql.clients,
        Array.from(
          new Array(cant),
          (value, index) => {
            const nombre = faker.name.fullName().toLowerCase();
            const apellidos = faker.name.lastName().toLowerCase();
            return [nombre, apellidos,
              (900_000_000 + index).toString(),
              faker.helpers.unique(faker.internet.email, [nombre, apellidos]),
              password
            ]
          }
        )
      )
    )
  }

  private async insertEmployees(cant: number) {
    await this.dataSource.query(
      format(
        SeedFormatSql.employees,
        Array.from(
          new Array(cant),
          (value, index) => (
            [faker.name.fullName(),
            (900_000_000 + index).toString(),
            (10_000_000 + index).toString()
            ]
          )
        )
      )
    )
  }

  private async insertMesas(cant: number) {
    await this.dataSource.query(
      format(
        SeedFormatSql.tables,
        Array.from(
          new Array(cant),
          (value, index) => [(faker.internet.password() + index).toLowerCase()]
        )
      )
    )
  }
  private async inserRoles() {
    const roles = ['admin', 'super-user', 'user']
    await this.dataSource.query(
      format(
        SeedFormatSql.roles,
        Array.from(
          new Array(3),
          (value, index) => [roles.at(index)]
        )
      )
    )
  }

  private async insertUsers(cant: number, emailSeed: UserSeed) {
    const employees = await this.employeeRepository.find();
    const roles = await this.roleRepository.find();
    const password = bcrypt.hashSync(`newPassWord_12312`, 10);
    await this.dataSource.query(
      format(
        SeedFormatSql.users,
        Array.from(
          new Array(cant),
          (value, index) => {
            if (cant - 1 === index) return [emailSeed.username,bcrypt.hashSync(emailSeed.password, 10), employees.at(index).id]
            else return [
              faker.internet.userName(
                faker.name.fullName()
                  .replaceAll(' ', '_')
                  .replaceAll("'", '')
                , index + ''),
              password,
              employees.at(index).id
            ]
          }

        )
      )
    )
    const users = await this.userRepository.find()
    const usersFilter = users.filter(x => x.username !== emailSeed.username)
    const usersRolesRegister = Array.from(
      new Array(cant - 1),
      (value, index) => ([
        usersFilter.at(index).id,
        roles.at(Math.floor(Math.random() * roles.length)).id
      ])
    )
    usersRolesRegister.push([users.find(x => x.username === emailSeed.username).id, roles.find(x => x.nombre === 'admin').id])
    await this.dataSource.query(
      format(
        SeedFormatSql.users_roles,
        usersRolesRegister
      )
    )
  }

}
