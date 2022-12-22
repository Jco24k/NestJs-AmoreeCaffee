const deleteFrom = 'delete from'
export enum SeedFormatSql {
    clients = 'INSERT INTO clientes (nombre,apellidos,telefono,correo,password,estado) VALUES %L',
    categories = 'INSERT INTO categorias (nombre,estado) VALUES %L',
    categories_images = 'INSERT INTO categoria_images(url,external,"categoriaId") VALUES %L',
    tables = 'INSERT INTO mesas (nombre) VALUES %L',
    products = 'INSERT INTO productos (nombre,descripcion,precio,cantidad,"categoriaId") VALUES %L',
    productsImages = 'INSERT INTO producto_images(url,external,"productoId") VALUES %L',

    orderHeader = 'INSERT INTO cabecera_pedido (id,"clienteId","mesaId",total,estado,cliente_pedido) VALUES %L',
    orderDetail = 'INSERT INTO detalle_pedido ("cabeceraPedidoId","productoId",precio,cantidad,subtotal) VALUES %L',
    voucher = 'INSERT INTO comprobantes ("nro","cabeceraPedidoId") VALUES %L',
    deleteMany = 'delete from '


}

 