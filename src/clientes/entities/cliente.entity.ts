import { CabeceraPedido } from 'src/cabecera-pedido/entities/cabecera-pedido.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'clientes' })

export class Cliente {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text',{
        nullable:false
    })
    nombre: string;
    @Column('text', {
        nullable: false,
    })
    apellidos: string;


    @Column('text', {
        nullable: false,
        unique:true
    })
    telefono: string; 



    @Column({
        type: 'text',
        nullable: false,
        unique:true
    })
    correo: string;


    @Column('text', {
        nullable: false,
        select: false
    })
    password: string;

    @Column('bool', {
        default: true
    })
    estado: boolean;

    @OneToMany(
        () => CabeceraPedido,
        ( cabeceraPedido ) => cabeceraPedido.cliente
    )
    cabeceraPedido: CabeceraPedido;


    @BeforeInsert()
    checkSlugInsert() {
        [this.nombre, this.apellidos, this.correo].forEach(atr => atr = atr.toLowerCase())
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        [this.nombre, this.apellidos, this.correo].forEach(atr => {
            if(atr) atr = atr.toLowerCase()
        })
    }


}
