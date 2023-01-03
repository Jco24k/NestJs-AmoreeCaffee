import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'roles' })
export class Role{

    @PrimaryGeneratedColumn('uuid')
    id: string;
    
    @ApiProperty({
        example: 'admin',
        description: 'Role "nombre"'
    })
    @Column('text',{
        nullable:false,
        unique:true
    })
    nombre: string;

    @ApiProperty({
        example: 'false',
        description: 'Role "estado"'
    })
    @Column('bool', {
        default: true
    }) 
    estado: boolean;
     
}
