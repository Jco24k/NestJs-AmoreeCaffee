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
import {  initialData } from './data/seed-data';
import { ConfigService } from '@nestjs/config';
import { EmailSeed } from './dto/email-seed.dto';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import * as format from 'pg-format';
import { SeedFormatSql } from './interfaces/seed-format.interface';

@Injectable()
export class SeedService {

  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Mesa)
    private readonly mesaRepository: Repository<Mesa>,
    @InjectRepository(Categoria)
    private readonly categoriaRepository: Repository<Categoria>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(CabeceraPedido)
    private readonly cabPedidoRepository: Repository<CabeceraPedido>,
    @InjectRepository(DetallePedido)
    private readonly detPedidoRepository: Repository<DetallePedido>,
    @InjectRepository(Comprobante)
    private readonly comprobanteRepository: Repository<Comprobante>,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource

  ) { }

  async seedExecute(emailSeed: EmailSeed) {
    const registerCant = { clientes: 20_000, categorias: 1_000, mesas: 20_000, productos: 2000 }
    const userValid: EmailSeed = { correo: this.configService.get<string>("CORREO_SEED"), password: this.configService.get<string>("PASSWORD_SEED") };
    if (emailSeed.correo !== userValid.correo || emailSeed.password !== userValid.password) throw new UnauthorizedException('Credentials are not valid');
    await this.deleteTables()
    try {
      console.time("inicio Creacion Cliente : " + registerCant.clientes);
    await this.insertClientes(registerCant.clientes);
    console.timeEnd("inicio Creacion Cliente : " + registerCant.clientes);
    console.time("inicio Creacion Categoria : " + registerCant.categorias);
    await this.insertCategorias(registerCant.categorias);
    console.timeEnd("inicio Creacion Categoria : " + registerCant.categorias);
    console.time("inicio Creacion Mesas : " + registerCant.mesas);
    await this.insertMesas(registerCant.mesas);
    console.timeEnd("inicio Creacion Mesas : " + registerCant.mesas);
    // console.time("inicio Creacion Productos : " + registerCant.productos);
    // await this.insertProductos(registerCant.productos);
    // console.timeEnd("inicio Creacion Productos : " + registerCant.productos);
    // const categorias: Categoria[] = await this.insertCategorias();
    // const mesas: Mesa[] = await this.insertMesas();
    // const productos: Producto[] = await this.insertProductos(categorias);
    // const cabeceraPedidos: CabeceraPedido[] = await this.insertsCabeceraPedidos(clientes, mesas, productos[0]);
    // const detallePedidos: DetallePedido[] = await this.insertsDetallePedidos(cabeceraPedidos, productos[0]);
    // const comprobantes: Comprobante[] = await this.insertsComprobante(cabeceraPedidos);
    return {
      clientes: `${registerCant.clientes} inserts`,
      categorias: `${registerCant.categorias} inserts`,
      mesas: `${registerCant.mesas} inserts`,
      productos: `${registerCant.productos} inserts`,
      // cabeceraPedidos: `${cabeceraPedidos.length} inserts`,
      // detallePedidos: `${detallePedidos.length} inserts`,
      // comprobantes: `${comprobantes.length} inserts`
    };
    } catch (error) {
      await this.deleteTables()
      return error;
    }

    
  }


  private async deleteTables() {
    const insertInitialPromises = [
      await this.comprobanteRepository.delete({}),
      await this.detPedidoRepository.delete({}),
      await this.cabPedidoRepository.delete({}),
      await this.productoRepository.delete({}),
      await this.clienteRepository.delete({}),
      await this.mesaRepository.delete({}),
      await this.categoriaRepository.delete({})
    ];
    await Promise.all(insertInitialPromises);
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
          password,true
        ]
      }
    )))
  }

  private async insertCategorias(cant: number) {
    await this.dataSource.query(format(SeedFormatSql.categories, Array.from(
      new Array(cant),
      (value, index) => [faker.internet.password() + index,true]
    )))
  }

  private async insertMesas(cant: number) {
    await this.mesaRepository.query(format(SeedFormatSql.tables, Array.from(
      new Array(cant),
      (value, index) => [faker.internet.password() + index]
    )))
  }

  private async insertProductos(cant:number) {
    const categories = await this.categoriaRepository.find()
    await this.productoRepository.query(format(SeedFormatSql.products, Array.from(
      new Array(cant), 
      (value, index) => [
        faker.datatype.uuid(),
        faker.commerce.product()+index,
        faker.commerce.productDescription(),
        faker.commerce.price(1,500,2,''),
        faker.datatype.number({ min:0 ,max: 200 }),
        true,
        null,
        categories.at(Math.floor(Math.random() * categories.length)).id
      ]
    )))
  }

  private async insertsCabeceraPedidos(clientes: Cliente[], mesas: Mesa[], producto: Producto) {
    const mesaList = this.mesaRepository.find();
    const clienteList = this.clienteRepository.find();
    const productoList = this.productoRepository.find();
    const cabPedidos: CabeceraPedido[] = [];
    for (let i = 0; i < 3; i++) {
      let indexCliente = Math.floor(Math.random() * clientes.length);
      let indexMesa = Math.floor(Math.random() * mesas.length);
      cabPedidos.push(this.cabPedidoRepository.create({
        cliente: clientes.at(indexCliente),
        mesa: mesas.at(indexMesa),
        total: producto.precio
      }))
    }
    return await this.cabPedidoRepository.save(cabPedidos)
  }

  private async insertsDetallePedidos(cabPedidos: CabeceraPedido[], producto: Producto) {
    const detPedidos: DetallePedido[] = [];
    for (let i = 0; i < 3; i++) {
      detPedidos.push(this.detPedidoRepository.create({
        cabeceraPedido: cabPedidos.at(i),
        producto: producto,
        precio: producto.precio,
        cantidad: 1
      }))
    }
    return await this.detPedidoRepository.save(detPedidos)
  }

  private async insertsComprobante(cabPedidos: CabeceraPedido[]) {
    const comprobantes: Comprobante[] = [];
    const seedComprobantes = initialData.comprobantes;
    seedComprobantes.forEach((comp: Comprobante, index) => {
      comp.cabeceraPedido = cabPedidos.at(index)
      comprobantes.push(this.comprobanteRepository.create(comp))
    });
    return await this.comprobanteRepository.save(comprobantes)
  }
}
