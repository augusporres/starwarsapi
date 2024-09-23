import { Module } from '@nestjs/common';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie-entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Movie]),
        HttpModule
      ],
      controllers: [MovieController],
      providers: [
        MovieService
      ],
      exports: [MovieService]
})
export class MovieModule {}