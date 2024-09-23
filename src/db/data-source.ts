import { Role } from "src/auth/entities/role-entity";
import { Movie } from "src/movie/entities/movie-entity";
import { User } from "src/user/entities/user.entity";
import { DataSource, DataSourceOptions } from "typeorm";
import {config} from 'dotenv';
config()

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [User, Movie, Role],
    synchronize: true,
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;