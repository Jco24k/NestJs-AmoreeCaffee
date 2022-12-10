import { Producto } from "src/productos/entities/producto.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";



@Entity({ name: 'categorias' })
export class Categoria {

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
        () => Producto,
        ( product ) => product.categoria
    )
    producto: Producto;
    

    
    @Column('text', {
        default: null,
        nullable:true
    })
    imagenUrl : string


    @BeforeInsert()
    checkSlugInsert() {
        this.nombre = this.nombre.toLowerCase();
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        if (this.nombre) this.nombre.toLowerCase();
    }
}
