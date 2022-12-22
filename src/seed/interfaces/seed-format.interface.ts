const deleteFrom = 'delete from'
export enum SeedFormatSql {
    clients = 'INSERT INTO clientes (nombre,apellidos,telefono,correo,password,estado) VALUES %L',
    categories = 'INSERT INTO categorias (nombre,estado) VALUES %L',
    categories_images = 'INSERT INTO categoria_images(url,external,"categoriaId") VALUES %L',
    tables = 'INSERT INTO mesas (nombre) VALUES %L',
    products = 'INSERT INTO productos (nombre,descripcion,precio,cantidad,"categoriaId") VALUES %L',
    deleteMany = 'delete from '

}

 