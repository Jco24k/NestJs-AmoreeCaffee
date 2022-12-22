import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Producto } from './producto.entity';


@Entity({ name: 'producto_images' })
export class ProductoImage {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    url: string;

    @ManyToOne(
        () => Producto,
        ( producto ) => producto.images,
        {  onDelete: 'CASCADE' }
    )
    producto: Producto

    @Column('bool',{
        default: false
    })
    external : boolean;

}