import { Producto } from "src/productos/entities/producto.entity";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { CategoriaImage } from "./categoria-image.entity";



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
    

    
    @OneToMany(
        () => CategoriaImage,
        (categoria_images) => categoria_images.categoria,
        { cascade: true, eager: true }
    )
    images?: CategoriaImage[];


    @BeforeInsert()
    checkSlugInsert() {
        this.nombre = this.nombre.toLowerCase();
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        if (this.nombre) this.nombre.toLowerCase();
    }
}
