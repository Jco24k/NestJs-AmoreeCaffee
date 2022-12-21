
export enum SeedFormatSql {
    clients = 'INSERT INTO clientes (nombre,apellidos,telefono,correo,password,estado) VALUES %L',
    categories = 'INSERT INTO categorias (nombre,estado) VALUES %L',
    categories_images = 'INSERT INTO categoria_images VALUES %L',
    tables = 'INSERT INTO mesas (nombre) VALUES %L',
    products = 'INSERT INTO productos VALUES %L',

}

 