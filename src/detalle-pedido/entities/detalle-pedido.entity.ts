import { type } from "os";
import { CabeceraPedido } from "src/cabecera-pedido/entities/cabecera-pedido.entity";
import { Producto } from "src/productos/entities/producto.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, RelationId } from "typeorm";


@Entity({ name: 'detalle_pedido' })
export class DetallePedido {


    @ManyToOne(type => CabeceraPedido)
    cabeceraPedido: CabeceraPedido;
    
    @PrimaryColumn()
    @RelationId((detalle: DetallePedido) => detalle.cabeceraPedido)
    cabeceraPedidoId: string;

    @ManyToOne(type => Producto)
    producto: Producto;

    @PrimaryColumn()
    @RelationId((detalle: DetallePedido) => detalle.producto)
    productoId: string;

    @Column('decimal', {
        precision: 9, scale: 2,
    })
    precio: number;

    @Column('int', {
        default: 1
    })
    cantidad: number;

    @Column({
        type: 'decimal', precision: 9, scale: 2,
        nullable: false
    })
    subtotal: number;


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
