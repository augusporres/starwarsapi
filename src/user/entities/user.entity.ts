import { Role } from "src/auth/entities/role-entity";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;
    @Column()
    password: string;
    @ManyToMany(() => Role)
    @JoinTable({ name: 'user_roles' })
    roles: Role[];
}