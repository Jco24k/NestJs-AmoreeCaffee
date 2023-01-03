import { ApiProperty } from "@nestjs/swagger";
import { Employee } from "../../employees/entities/employee.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "src/roles/entities/role.entity";


@Entity({ name: 'usuarios' })
export class User  {


    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: '637fbd82147dbb5978605da1',
        description: 'User "id_employee"',
        type: String,
        uniqueItems: true,
    })
    @OneToOne(() => Employee)
    @JoinColumn()
    empleado: Employee

    @ApiProperty({
        example: 'UsEr_OnE01',
        description: 'User "username"',
        type: String,
        uniqueItems: true,
    })
    @Column('text',{ unique: true })
    username: string;

    @ApiProperty({
        example: '12345abcde',
        description: 'User "password"',
        type: String,
        uniqueItems: true,
    })
    @Column('text',{ select:false})
    password: string;

    @ApiProperty({
        example: ['637fbd82147dbb5978605d9a',
            '637fbd82147dbb5978605d9b', '637fbd82147dbb5978605d9c'],
        description: 'User "roles"',
        type: [String],
        uniqueItems: true,
    })
    @ManyToMany(() => Role)
    @JoinTable()
    roles: Role[];

    @ApiProperty({
        example: true,
        description: 'Employee "status"',
        default: true
    })
    @Column('bool',{
        default: true
    })
    estado : boolean;

}
