import { Injectable, NotFoundException } from '@nestjs/common';
import { GetMovieFromApiDto } from './dto/get-movie-from-api.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { CreateMovieDto } from './dto/create-movie.dto';
import { GetMovieDto } from './dto/get-movie.dto';
import { plainToInstance } from 'class-transformer';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './entities/movie-entity';
import { GetMovieDetailDto } from './dto/get-movie-detail.dto';

@Injectable()
export class MovieService {
    constructor(
        @InjectRepository(Movie) private movieRepository: Repository<Movie>,
        private readonly httpService: HttpService
    ) {}

    async findAll(): Promise<GetMovieDto[]> {
        const movies = await this.movieRepository.find();
        return movies.map(movie => plainToInstance(GetMovieDto, {
            title: movie.title,
            episodeId: movie.episodeId,
            director: movie.director,
            releaseDate: movie.releaseDate,
        }));
    }
    async findByEpisode(episode: number): Promise<GetMovieDetailDto> {
        const movie =  await this.movieRepository.findOneBy({episodeId: episode});
        if (!movie) {
            throw new NotFoundException(`Movie with episode ${episode} not found`);
        }
        return plainToInstance(GetMovieDto, {
            title: movie.title,
            episodeId: movie.episodeId,
            director: movie.director,
            releaseDate: movie.releaseDate,
        });
    }

    async create(movie: CreateMovieDto): Promise<Movie> {
        const newMovie = this.movieRepository.create(movie)
        return this.movieRepository.save(newMovie);
    }
    async updateFromApi(): Promise<GetMovieFromApiDto[]> {
        const url = 'https://swapi.dev/api/films'
        try {
            const response = await firstValueFrom(this.httpService.get(url))
            const movies: GetMovieFromApiDto[] =  response.data.results.map(movie => ({
                title: movie.title,
                episode: movie.episode_id,
                // openningCrawl: movie.opening_crawl,
                director: movie.director,
                releaseDate: movie.release_date
            }))
            console.log('movies', movies)
            for (const movie of movies){
                const movieFromDb = await this.movieRepository.findOneBy({ episodeId: movie.episode }); // find by episodeId
                if(movieFromDb) {

                    Object.assign(movieFromDb, {
                        title: movie.title,
                        episodeId: movie.episode,
                        director: movie.director,
                        releaseDate: movie.releaseDate
                    });
                    this.movieRepository.save(movieFromDb);
                } else {
                    const newMovie = this.movieRepository.create({
                        title: movie.title,
                        episodeId: movie.episode,
                        director: movie.director,
                        releaseDate: movie.releaseDate
                    });
                    await this.movieRepository.save(newMovie);
                }
            }
            return movies;  
        } catch (error) {
            console.error('Error fetching movies', error);
            throw new Error('Failed to fetch movies from the external API');
        }
    }

    async updateByEpisode(episode: number, movie: UpdateMovieDto): Promise<UpdateMovieDto> {
        let movieFromDb = await this.movieRepository.findOneBy({episodeId: episode});
        if(! movieFromDb) {
            throw new NotFoundException(`Movie with episode ${episode} not found`);
        }
        Object.assign(movieFromDb, movie);

        const updatedMovie = await this.movieRepository.save(movieFromDb);
        return {
            title: updatedMovie.title,
            episodeId: updatedMovie.episodeId,
            director: updatedMovie.director,
            releaseDate: updatedMovie.releaseDate,
        } as UpdateMovieDto;
    }
    async deleteByEpisode(episode: number): Promise<string> {
        let deletedMovie = await this.movieRepository.delete({episodeId: episode});
        if( deletedMovie.affected === 0) {
            throw new NotFoundException(`Movie with episode ${episode} not found`);
        }
        return "Movie successfully deleted";
    }
}
