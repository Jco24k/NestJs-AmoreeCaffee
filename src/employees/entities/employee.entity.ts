import { ApiProperty, ApiTags } from "@nestjs/swagger";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'empleados' })
export class Employee{


    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'jesus coronado',
        description: 'Employee "names"'
    })
    @Column('text',{
        nullable:false
    })
    nombre:string;

    @ApiProperty({
        example: '999666111',
        description: 'Employee "phones"',
        uniqueItems: true,
        minLength: 9,
        maxLength: 9
    })
    @Column('text', {
        nullable: false,
        unique:true
    })
    telefono: string;

    @ApiProperty({
        example: '45612378',
        description: 'Employee "dni"',
        uniqueItems: true,
        minLength: 8,
        maxLength: 8
    })
    @Column('text', {
        nullable: false,
        unique:true
    })
    dni: string;

    @ApiProperty({
        example: true,
        description: 'Employee "status"',
        default: true
    })
    @Column('bool', {
        default: true
    })
    estado: boolean;
    

}
