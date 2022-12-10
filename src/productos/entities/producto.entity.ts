import { Categoria } from "src/categorias/entities/categoria.entity";
import { DetallePedido } from "src/detalle-pedido/entities/detalle-pedido.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity({ name: 'productos' })
export class Producto {
    
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        nullable: false,
        unique: true
    })
    nombre: string;


    @Column('text', {
        nullable: false,
    })
    descripcion: string;

    @Column('decimal',{
        precision: 9, scale: 2,
        nullable:false
    })
    precio: number;

    @Column('int', {
        default: 1,
        nullable:false
    })
    cantidad: number;

    @ManyToOne(
        () => Categoria,
        ( categoria ) => categoria.producto,
        { eager: true , nullable:false}
    )
    categoria: Categoria

    @OneToMany(
        () => DetallePedido,
        ( detalle_pedido ) => detalle_pedido.producto
    )
    detalle_pedido: DetallePedido;

    @Column('bool', {
        default: true
    })
    estado: boolean;


    @BeforeInsert()
    checkSlugInsert() {
        this.nombre = this.nombre.toLowerCase();
        if(!this.descripcion) this.descripcion = this.nombre.toLowerCase();
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        if (this.nombre) this.nombre.toLowerCase();
    }

    @Column('text', {
        default: null,
        nullable:true
    })
    imagenUrl ?: string
    
}
