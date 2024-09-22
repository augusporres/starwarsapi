import { Injectable, NotFoundException } from '@nestjs/common';
import { Movie } from './interfaces/movie.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetMovieFromApiDto } from './dto/get-movie-from-api.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { CreateMovieDto } from './dto/create-movie.dto';
import { GetMovieDto } from './dto/get-movie.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MovieService {
    constructor(
        @InjectModel('Movie') private movieModel: Model<Movie>,
        private readonly httpService: HttpService
    ) {}

    async findAll(): Promise<GetMovieDto[]> {
        const movies = await this.movieModel.find().exec();
        return movies.map(movie => plainToInstance(GetMovieDto, {
            title: movie.title,
            episodeId: movie.episodeId,
            director: movie.director,
            releaseDate: movie.releaseDate,
        }));
    }
    async findByEpisode(episode: number): Promise<Movie> {
        const movie =  await this.movieModel.findOne({episodeId: episode}).exec();
        if (!movie) {
            throw new NotFoundException(`Movie with episode ${episode} not found`);
        }
        return movie;
    }

    async create(movie: CreateMovieDto): Promise<Movie> {
        const newMovie = new this.movieModel(movie)
        return newMovie.save();
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
            for (const movie of movies){
                await this.movieModel.findOneAndUpdate(
                    { episodeId: movie.episode }, // find by episodeId
                    { $set: movie },
                    { upsert: true, new: true } // upsert
                )
            }
            return movies;  
        } catch (error) {
            console.error('Error fetching movies', error);
            throw new Error('Failed to fetch movies from the external API');
        }
    }

    async updateByEpisode(episode: number, movie: UpdateMovieDto): Promise<Movie> {
        let updatedMovie = await this.movieModel.findOneAndUpdate({episodeId: episode}, movie, {new: true}).exec();
        if(! updatedMovie) {
            throw new NotFoundException(`Movie with episode ${episode} not found`);
        }
        return updatedMovie;
    }
    async deleteByEpisode(episode: number): Promise<string> {
        let deletedMovie = await this.movieModel.findOneAndDelete({episodeId: episode}).exec();
        if(! deletedMovie) {
            throw new NotFoundException(`Movie with episode ${episode} not found`);
        }
        return "Movie successfully deleted";
    }
}
