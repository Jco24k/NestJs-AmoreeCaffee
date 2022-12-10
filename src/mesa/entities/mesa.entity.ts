import { CabeceraPedido } from "src/cabecera-pedido/entities/cabecera-pedido.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";



@Entity({ name: 'mesas' })
export class Mesa {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        nullable: false,
        unique: true
    })
    nombre: string;

    @Column('bool', {
        default: true
    })
    estado: boolean;

    @OneToMany(
        () => CabeceraPedido,
        ( cabecera_pedido ) => cabecera_pedido.mesa
    )
    cabecera_pedido: CabeceraPedido;
    
    @BeforeInsert()
    checkSlugInsert() {
        this.nombre = this.nombre.toLowerCase();
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        if (this.nombre) this.nombre.toLowerCase();
    }
}

