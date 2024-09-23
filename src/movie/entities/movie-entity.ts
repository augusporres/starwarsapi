import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Movie  {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    title: string;
    @Column()
    episodeId: number;
    @Column()
    director: string;
    @Column()
    releaseDate: Date
};