import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Categoria } from './categoria.entity';


@Entity({ name: 'categoria_images' })
export class CategoriaImage {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    url: string;

    @ManyToOne(
        () => Categoria,
        ( categoria ) => categoria.images,
        {  onDelete: 'CASCADE' }
    )
    categoria: Categoria

    @Column('bool',{
        default: false
    })
    external : boolean;

}