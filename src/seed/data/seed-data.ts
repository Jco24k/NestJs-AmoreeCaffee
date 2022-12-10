import * as bcrypt from 'bcrypt';
import { Categoria } from 'src/categorias/entities/categoria.entity';

interface SeedData {
    clientes: SeedCliente[];
    mesas: SeedMesa[];
    categorias: SeedCategoria[];
    productos: SeedProducto[];
    comprobantes: SeedComprobante[];

}

interface SeedCliente {
    nombre: string;
    apellidos: string;
    telefono: string;
    correo: string;
    password: string;
}

interface SeedMesa {
    nombre: string;
}

interface SeedCategoria {
    nombre: string;
}

interface SeedProducto {
    nombre: string;
    descripcion: string;
    precio: number;
    cantidad: number;
    option: string;
}

interface SeedComprobante {
    tipo: string;
    nro: string;
}
export const initialData: SeedData = {
    clientes: [
        {
            nombre: 'pedro',
            apellidos: 'sanchez',
            telefono: '999666888',
            correo: 'new@gmail.com',
            password: bcrypt.hashSync('12345abcde', 10)
        },
        {
            nombre: 'juan',
            apellidos: 'perez',
            telefono: '966333222',
            correo: 'UsEr_OnE02@gmail.com',
            password: bcrypt.hashSync('abcde12345', 10)
        },
        {
            nombre: 'antonella',
            apellidos: 'da silva',
            telefono: '977444555',
            correo: 'UsEr_OnE03@gmail.com',
            password: bcrypt.hashSync('fghij56789', 10)
        }
    ],
    mesas: [
        {
            nombre: 'mesaA1015'
        },
        {
            nombre: 'mesaB1233'
        },
        {
            nombre: 'mesaC1231'
        }
    ],
    categorias: [
        {
            nombre: 'desayunos'
        },
        {
            nombre: 'bebidas'
        },
        {
            nombre: 'postres'
        },
        {
            nombre: 'jugos'
        }
    ],

    productos: [
        //DESAYUNOS
        {
            nombre: 'ensalada de frutas',
            descripcion: 'Ensalada de frutas que contiene arándanos, trozos de fresa, papaya, durazno y yogurt griego ',
            precio: 10,
            cantidad: 50,
            option: 'desayunos'
        },
        {
            nombre: 'yogurt con cereales y frutas',
            descripcion: 'Yogurt con cereales naturales y frutillas que contiene trigo, arándanos, frambuesas y semillas de chia',
            precio: 12,
            cantidad: 20,
            option: 'desayunos'
        },
        {
            nombre: 'royal egg',
            descripcion: 'Desayuno tradicional que contiene huevos fritos, 2 tostadas a la francesa, tiras de tocino frito y tomates cherry ',
            precio: 5,
            cantidad: 30,
            option: 'desayunos'
        },


        //BEBIDAS
        {
            nombre: 'café',
            descripcion: 'Café caliente de Oxapampa',
            precio: 10,
            cantidad: 50,
            option: 'bebidas'
        },
        {
            nombre: 'frappuccinno',
            descripcion: 'Mezcla de hielo y café con otros ingredientes',
            precio: 12,
            cantidad: 20,
            option: 'bebidas'
        },
        {
            nombre: 'MILKSHAKE',
            descripcion: 'Batido elaborado a base de leche o helado con diferentes sabores(fresa, chocolate, vainilla)',
            precio: 5,
            cantidad: 30,
            option: 'bebidas'
        },


        //JUGOS
        {
            nombre: 'NARANJA',
            descripcion: 'Jugo hecho a base de naranjas ',
            precio: 10,
            cantidad: 50,
            option: 'jugos'
        },
        {
            nombre: 'FRESA',
            descripcion: 'Jugo hecho a base de fresas',
            precio: 12,
            cantidad: 20,
            option: 'jugos'
        },
        {
            nombre: 'PAPAYA',
            descripcion: 'Jugo hecho a base de papaya',
            precio: 5,
            cantidad: 30,
            option: 'jugos'
        },


        //POSTRES
        {
            nombre: 'TORTA DE CHOCOLATE',
            descripcion: 'Torta de chocolate con canela y relleno de mermelada',
            precio: 10,
            cantidad: 50,
            option: 'postres'
        },
        {
            nombre: 'PIE DE LIMON',
            descripcion: 'Pie hecho a base de limon ',
            precio: 12,
            cantidad: 20,
            option: 'postres'
        },
        {
            nombre: 'TARTALETA',
            descripcion: 'Tartaleta clasica con crema pastelera de relleno',
            precio: 5,
            cantidad: 30,
            option: 'postres'
        },


    ], 
    comprobantes: [
        {
            tipo: 'factura',
            nro:  '987654321112'
        },
        {
            tipo: 'boleta',
            nro:  '987654321236'
        },
        {
            tipo: 'factura',
            nro:  '886654331237'
        }
    ],



}