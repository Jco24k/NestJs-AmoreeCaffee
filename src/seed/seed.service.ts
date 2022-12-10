import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CabeceraPedido } from 'src/cabecera-pedido/entities/cabecera-pedido.entity';
import { Categoria } from 'src/categorias/entities/categoria.entity';
import { Cliente } from 'src/clientes/entities/cliente.entity';
import { Comprobante } from 'src/comprobante/entities/comprobante.entity';
import { DetallePedido } from 'src/detalle-pedido/entities/detalle-pedido.entity';
import { Mesa } from 'src/mesa/entities/mesa.entity';
import { Producto } from 'src/productos/entities/producto.entity';
import { Repository } from 'typeorm';
import { initialData } from './data/seed-data';

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
  ) { }

  async seedExecute() {
    await this.deleteTables()
    const clientes: Cliente[] = await this.insertClientes();
    const categorias: Categoria[] = await this.insertCategorias();
    const mesas: Mesa[] = await this.insertMesas();
    const productos: Producto[] = await this.insertProductos(categorias);
    const cabeceraPedidos: CabeceraPedido[] = await this.insertsCabeceraPedidos(clientes,mesas,productos[0]);
    const detallePedidos: DetallePedido[] = await this.insertsDetallePedidos(cabeceraPedidos,productos[0]);
    const comprobantes: Comprobante[] = await this.insertsComprobante(cabeceraPedidos);

    return {
      clientes: `${clientes.length} inserts`,
      categorias: `${categorias.length} inserts`,
      mesas: `${mesas.length} inserts`,
      productos: `${productos.length} inserts`,
      cabeceraPedidos: `${cabeceraPedidos.length} inserts`,
      detallePedidos: `${detallePedidos.length} inserts`,
      comprobantes: `${comprobantes.length} inserts`
    };
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

  private async insertClientes() {
    const clients: Cliente[] = [];
    const seedClientes = initialData.clientes;
    seedClientes.forEach(cli => {
      clients.push(this.clienteRepository.create(cli))
    });
    return await this.clienteRepository.save(clients)
  }

  private async insertCategorias() {
    const categorias: Categoria[] = [];
    const seedCategorias = initialData.categorias;
    seedCategorias.forEach(cat => {
      categorias.push(this.categoriaRepository.create(cat))
    });
    return await this.categoriaRepository.save(categorias)
  }

  private async insertMesas() {
    const mesas: Mesa[] = [];
    const seedMesas = initialData.mesas;
    seedMesas.forEach(mesa => {
      mesas.push(this.mesaRepository.create(mesa))
    });
    return await this.mesaRepository.save(mesas)
  }

  private async insertProductos(categorias: Categoria[]) {
    const productos: Producto[] = [];
    const seedProductos = initialData.productos;
    seedProductos.forEach(({ option, ...detailsPro }) => {
      const categoria:Categoria= categorias.find((cat)=> cat.nombre === option);
      productos.push(this.productoRepository.create({...detailsPro, categoria}))
    });
    return await this.productoRepository.save(productos)
  }

  private async insertsCabeceraPedidos(clientes: Cliente[],mesas: Mesa[],producto:Producto) {
    const cabPedidos: CabeceraPedido[] = [];
    for(let i = 0; i<3;i++){
      let indexCliente= Math.floor(Math.random() * clientes.length);
      let indexMesa = Math.floor(Math.random() * mesas.length);
      cabPedidos.push(this.cabPedidoRepository.create({
        cliente: clientes.at(indexCliente),
        mesa: mesas.at(indexMesa),
        total: producto.precio
      }))
    }
    return await this.cabPedidoRepository.save(cabPedidos)
  }

  private async insertsDetallePedidos(cabPedidos: CabeceraPedido[],producto:Producto) {
    const detPedidos: DetallePedido[] = [];
    for(let i = 0; i<3;i++){
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
    seedComprobantes.forEach((comp:Comprobante,index) => {
      comp.cabeceraPedido = cabPedidos.at(index)
      comprobantes.push(this.comprobanteRepository.create(comp))
    });
    return await this.comprobanteRepository.save(comprobantes)
  }
}
