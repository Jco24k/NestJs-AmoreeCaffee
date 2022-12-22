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
import { EmailSeed } from './dto/email-seed.dto';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import * as format from 'pg-format';
import { SeedFormatSql } from './interfaces/seed-format.interface';
import { ProductoImage } from 'src/producto-image/entities/producto-image.entity';
import { CategoriaImage } from 'src/categoria-image/entities/categoria-image.entity';
import { CategoriasService } from 'src/categorias/categorias.service';

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
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
    private readonly categoriaService: CategoriasService

  ) { }

  async seedExecute(emailSeed: EmailSeed) {
    const registerCant = { clientes: 20_000, categorias: 20_000, mesas: 20_000, productos: 20_000, cabeceraPedido: 2000, cantidadDetalle: 5 }
    const userValid: EmailSeed = { correo: this.configService.get<string>("CORREO_SEED"), password: this.configService.get<string>("PASSWORD_SEED") };
    if (emailSeed.correo !== userValid.correo || emailSeed.password !== userValid.password) throw new UnauthorizedException('Credentials are not valid');
    console.log('INICIO')
    console.time("ELIMINACION");
    await this.deleteTables();
    console.timeEnd("ELIMINACION");
    console.log('Eliminado')
    try {
      console.time("inicio tablas primarias : " + registerCant.clientes);
      await Promise.allSettled([this.insertClientes(registerCant.clientes), this.insertMesas(registerCant.mesas)])
      console.timeEnd("inicio tablas primarias : " + registerCant.clientes);

      await this.dataSource.query(format(SeedFormatSql.categories, Array.from(
        new Array(registerCant.categorias),
        (value, index) => [faker.commerce.department() + index, true]
      )))
      const categories = await this.categoriaRepository.find()
      await this.dataSource.query(format(SeedFormatSql.categories_images, Array.from(
        new Array(registerCant.categorias),
        (value, index) => [
          faker.image.abstract(640, 480, true),
          true,
          categories.at(index).id
        ]
      )))

      console.time("inicio Creacion Productos : " + registerCant.productos);
      await this.dataSource.query(format(SeedFormatSql.products, Array.from(
        new Array(registerCant.productos),
        (value, index) => [
          faker.commerce.product() + index,
          faker.commerce.productDescription(),
          +faker.datatype.number({ min: 10, max: 500, precision: 0.01 }),
          +faker.datatype.number({ min: 1, max: 200 }),
          categories.at(Math.floor(Math.random() * categories.length)).id
        ]
      )))

      const productos = await this.productoRepository.find()
      await this.dataSource.query(format(SeedFormatSql.productsImages, Array.from(
        new Array(registerCant.productos),
        (value, index) => [
          faker.image.food(640, 480, true),
          true,
          productos.at(index).id
        ]
      )))

      console.timeEnd("inicio Creacion Productos : " + registerCant.productos);


      // await this.insertProductos(registerCant.productos);
      console.time("inicio Creacion Pedido : " + registerCant.productos);
      const mesaList = await this.mesaRepository.find();
      const clienteList = await this.clienteRepository.find();

      const idsCabecera = Array.from(new Array(registerCant.cabeceraPedido), () => faker.datatype.uuid())

      const detallePedido = Array.from(
        new Array(registerCant.cabeceraPedido),
        (value, indice) => {
          let detailsPro = new Array(registerCant.cantidadDetalle).
            fill(null).map((value, index) => {
              const cantidad = Math.floor(Math.random() * 10 + 1);
              const { precio, id } = productos.at(index)
              return [idsCabecera.at(indice), id, +precio, +cantidad, +(precio * cantidad).toFixed(2)]
            })
          return detailsPro
        }
      ).flat();
      const cabeceraPedido = idsCabecera.reduce(
        (total, id) => {
          let clientIndex = Math.floor(Math.random() * clienteList.length);
          let tableIndex = Math.floor(Math.random() * mesaList.length);
          const tot = detallePedido.reduce(
            (total, x) => id !== x[0] ? total : total + (+x[3]), 0)
          total.push(
            [id, clienteList.at(clientIndex).id, mesaList.at(tableIndex).id,
              +tot.toFixed(2), true, clienteList.at(clientIndex).nombre])
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
    await this.mesaRepository.delete({})
  }

  private async insertClientes(cant: number) {
    const password = bcrypt.hashSync(`fghij56789`, 10);
    await this.dataSource.query(format(SeedFormatSql.clients, Array.from(
      new Array(cant),
      (value, index) => {
        const nombre = faker.name.fullName();
        const apellidos = faker.name.lastName();
        return [nombre, apellidos,
          (900_000_000 + index).toString(),
          faker.helpers.unique(faker.internet.email, [nombre, apellidos]),
          password, true
        ]
      }
    )))
  }

  private async insertMesas(cant: number) {
    await this.dataSource.query(format(SeedFormatSql.tables, Array.from(
      new Array(cant),
      (value, index) => [faker.internet.password() + index]
    )))
  }

}
