import { Cliente } from "src/clientes/entities/cliente.entity";
import { Comprobante } from "src/comprobante/entities/comprobante.entity";
import { DetallePedido } from "src/detalle-pedido/entities/detalle-pedido.entity";
import { Mesa } from "src/mesa/entities/mesa.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'cabecera_pedido' })
export class CabeceraPedido {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(
        () => Cliente,
        (cliente) => cliente.cabeceraPedido,
        { eager: true, nullable: false }
    )
    cliente: Cliente;

    @Column('text', {
        nullable:false,
        default: 'efectivo'
    })
    forma_pago: string;

    @Column('text', {
        nullable:false
    })
    cliente_pedido: string;


    @ManyToOne(
        () => Mesa,
        (mesa) => mesa.cabecera_pedido,
        { eager: true, nullable: true, }
    )
    mesa ?: Mesa;
    
    @OneToMany(
        () => Comprobante,
        ( comprobante ) => comprobante.cabeceraPedido
    )
    comprobante: Comprobante;

    
    @Column({
        type: 'timestamp', default: () => "CURRENT_TIMESTAMP"
    })
    fecha: Date
    
    @Column({
        type: 'decimal', precision: 9, scale: 2,
        nullable:false
    })
    total: number;
    
    
    @Column('bool', {
        default: true
    })
    estado: boolean;


    @Column('text', {
        nullable: false,
        default: 'llevar'
    })
    tipo_pedido: string;

    @OneToMany(
        () => DetallePedido,
        ( detalle_pedido ) => detalle_pedido.cabeceraPedido
    )
    detalle_pedido: DetallePedido;

    @BeforeInsert()
    checkSlugInsert() {
        if(!this.cliente_pedido) this.cliente_pedido = `${this.cliente.nombre} ${this.cliente.apellidos}`
        this.cliente_pedido = this.cliente_pedido.toLowerCase();
        
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        if(this.cliente_pedido) this.cliente_pedido = this.cliente_pedido.toLowerCase()

    }
}
