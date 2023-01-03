const deleteFrom = 'delete from'
export enum SeedFormatSql {
    employees = 'INSERT INTO empleados (nombre,telefono,dni) VALUES %L',
    roles = 'INSERT INTO roles (nombre) VALUES %L',
    users = 'INSERT INTO usuarios (username,password,"empleadoId") VALUES %L',
    users_roles = 'INSERT INTO usuarios_roles_roles ("usuariosId","rolesId") VALUES %L',
    clients = 'INSERT INTO clientes (nombre,apellidos,telefono,correo,password) VALUES %L',
    categories = 'INSERT INTO categorias (nombre,estado) VALUES %L',
    categories_images = 'INSERT INTO categoria_images(url,external,"categoriaId") VALUES %L',
    tables = 'INSERT INTO mesas (nombre) VALUES %L',
    products = 'INSERT INTO productos (nombre,descripcion,precio,cantidad,"categoriaId") VALUES %L',
    productsImages = 'INSERT INTO producto_images(url,external,"productoId") VALUES %L',

    orderHeader = 'INSERT INTO cabecera_pedido (id,"clienteId","mesaId",total,estado,cliente_pedido) VALUES %L',
    orderDetail = 'INSERT INTO detalle_pedido ("cabeceraPedidoId","productoId",precio,cantidad,subtotal) VALUES %L',
    voucher = 'INSERT INTO comprobantes ("nro","cabeceraPedidoId") VALUES %L',


}

 