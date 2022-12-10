import { CabeceraPedido } from "src/cabecera-pedido/entities/cabecera-pedido.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";



@Entity({ name: 'comprobantes' })
export class Comprobante {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        nullable: false,
        default: 'boleta'
    })
    tipo: string;

    @Column('text', {
        unique: true,
        nullable: false
    })
    nro: string;

    @ManyToOne(
        () => CabeceraPedido,
        (cabeceraPedido) => cabeceraPedido.comprobante,
        { eager: true, nullable: false }
    )
    cabeceraPedido: CabeceraPedido;
    
    @Column('bool', {
        default: true
    })
    estado: boolean;

    @BeforeInsert()
    checkSlugInsert() {
        this.tipo = this.tipo.toLowerCase();
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        if (this.tipo) this.tipo.toLowerCase();
    }

}