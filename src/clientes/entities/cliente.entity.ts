import { type } from 'os';
import { CabeceraPedido } from 'src/cabecera-pedido/entities/cabecera-pedido.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { ApiProperty } from "@nestjs/swagger";

@Entity({ name: 'clientes' })

export class Cliente {
    @PrimaryGeneratedColumn('uuid')
    @ApiProperty({
        example: "96856f1e-94f5-463b-acfa-e7f17db5770e",
        description: ' id "(autogenerated)"',
        default: uuid(),
        type: String
    })
    id: string;

    @Column('text', {
        nullable: false
    })
    @ApiProperty({
        example: 'jesus',
        description: '"nombre"',
        nullable: false,
        type: String,
    })
    nombre: string;
    @Column('text', {
        nullable: false,
    })
    @ApiProperty({
        example: 'coronado',
        description: '"apellidos"',
        nullable: false,
        type: String,
    })
    apellidos: string;


    @Column('text', {
        nullable: false,
        unique: true
    })
    @ApiProperty({
        example: '999666333',
        description: '"telefono"',
        maxLength: 9,
        minLength: 9,
        nullable: false,
        type: String,
    })
    telefono: string;


    @ApiProperty({
        example: 'coronado@gmail.com',
        description: '"correo"',
        nullable: false,
        type: String,
    })
    @Column({
        type: 'text',
        nullable: false,
        unique: true
    })
    correo: string;


    @ApiProperty({
        example: 'asdasdEsadzDEas_123',
        description: '"password"',
        nullable: false,
        type: String,
    })
    @Column('text', {
        nullable: false,
        select: false
    })
    password: string;

    @ApiProperty({
        example: true,
        description: '"estado"',
        default: true,
        type: Boolean,
    })
    @Column('bool', {
        default: true
    })
    estado: boolean;

    @OneToMany(
        () => CabeceraPedido,
        (cabeceraPedido) => cabeceraPedido.cliente
    )
    cabeceraPedido: CabeceraPedido[];


    @BeforeInsert()
    checkSlugInsert() {
        [this.nombre, this.apellidos, this.correo].forEach(atr => atr = atr.toLowerCase())
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        [this.nombre, this.apellidos, this.correo].forEach(atr => {
            if (atr) atr = atr.toLowerCase()
        })
    }


}
