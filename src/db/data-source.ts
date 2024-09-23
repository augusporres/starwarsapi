import { Role } from "src/auth/entities/role-entity";
import { Movie } from "src/movie/entities/movie-entity";
import { User } from "src/user/entities/user.entity";
import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
    type: 'mariadb',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'starwars',
    entities: [User, Movie, Role],
    synchronize: false,
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;