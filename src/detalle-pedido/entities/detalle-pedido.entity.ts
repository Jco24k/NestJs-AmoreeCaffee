import { type } from "os";
import { CabeceraPedido } from "src/cabecera-pedido/entities/cabecera-pedido.entity";
import { Producto } from "src/productos/entities/producto.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, RelationId } from "typeorm";
import { ApiProperty } from '@nestjs/swagger';
import { v4 as uuid } from 'uuid';


@Entity({ name: 'detalle_pedido' })
export class DetallePedido {


    @ApiProperty({
        example: { id: uuid() },
        description: '"cabeceraPedido"',
        type: () => CabeceraPedido,
        nullable: false
    })
    @ManyToOne(type => CabeceraPedido, {  onDelete: 'CASCADE' })
    cabeceraPedido: CabeceraPedido;
    
    @PrimaryColumn()
    @RelationId((detalle: DetallePedido) => detalle.cabeceraPedido)
    cabeceraPedidoId: string;


    @ApiProperty({
        example: { id: uuid() },
        description: '"producto"',
        type: () => Producto,
        nullable: false
    })
    @ManyToOne(type => Producto)
    producto: Producto;

    @PrimaryColumn()
    @RelationId((detalle: DetallePedido) => detalle.producto)
    productoId: string;


    @ApiProperty({
        example: 12.50,
        description: '"precio"',
        nullable:false,
        type: Number

    })
    @Column('decimal', {
        precision: 9, scale: 2,
    })
    precio: number;

    @ApiProperty({
        example: 3,
        description: '"cantidad"',
        nullable:false,
        type: Number

    })
    @Column('int', {
        default: 1
    })
    cantidad: number;

    @ApiProperty({
        example: 37.50,
        description: '"subtotal"',
        nullable:false,
        type: Number

    })
    @Column({
        type: 'decimal', precision: 9, scale: 2,
        nullable: false
    })
    subtotal: number;

    @ApiProperty({
        example: true,
        description: '"estado"',
        default: true,
    })
    @Column('bool', {
        default: true
    })
    estado: boolean;


    @BeforeInsert()
    @BeforeUpdate()
    checkSlugInsert() {
        this.subtotal = this.precio * this.cantidad;
    }


}
