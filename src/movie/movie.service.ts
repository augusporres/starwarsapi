import { Injectable } from '@nestjs/common';
import { Movie } from './interfaces/movie.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GetMovieFromApiDto } from './dto/get-movie-from-api.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MovieService {
    constructor(
        @InjectModel('Movie') private movieModel: Model<Movie>,
        private readonly httpService: HttpService
    ) {}

    async findAll(): Promise<Movie[]> {
        return this.movieModel.find().exec();
    }
    async findByTitle(title: string): Promise<Movie> {
        return this.movieModel.findOne({title}).exec();
    }

    async create(movie: Movie): Promise<Movie> {
        const newMovie = new this.movieModel(movie);
        return newMovie.save();
    }
    async updateFromApi(): Promise<GetMovieFromApiDto[]> {
        const url = 'https://swapi.dev/api/films'
        try {
            const response = await firstValueFrom(this.httpService.get(url))
            let data =  response.data.results.map(movie => ({
                title: movie.title,
                episodeId: movie.episode_id,
                openningCrawl: movie.opening_crawl,
                director: movie.director
            }))
            console.log('movies', data);
            return data;
        } catch (error) {
            console.error('Error fetching movies', error);
            throw new Error('Failed to fetch movies from the external API');
        }
    }
}
