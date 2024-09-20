import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MovieSchema } from './schemas/movie.schema';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Movie', schema: MovieSchema}]),
        HttpModule
      ],
      controllers: [MovieController],
      providers: [
        MovieService
      ],
      exports: [MovieService]
})
export class MovieModule {}