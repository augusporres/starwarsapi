import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MovieService } from './movie.service';
import { Movie } from './interfaces/movie.interface';
import { CreateMovieDto } from './dto/create-movie.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public, Roles } from 'src/auth/constants';
import { GetMovieDto } from './dto/get-movie.dto';
import { GetMovieDetailDto } from './dto/get-movie-detail.dto';

@ApiTags('Movies')
@Controller('movies')
export class MovieController {
    constructor(private readonly movieService: MovieService){}

    @Public()
    @ApiOperation({summary: 'Create new movie'})
    @ApiResponse({status: 200, description: 'The created movie', type: String})
    @ApiBody({type: CreateMovieDto})
    @Post('create')
    async create(@Body() movie: Movie) {
        return this.movieService.create(movie);
    }
    
    @Public()
    @ApiOperation({summary: 'Get all movies'})
    @ApiResponse({status: 200, description: 'The created movie', type: [GetMovieDto]})
    @Get('all')
    async get() {
        return this.movieService.findAll();
    }
    
    @Roles('admin')
    @ApiOperation({summary: 'Update movies'})
    @ApiBearerAuth('access-token')  
    @Get('update')
    async updateMovies() {
        return this.movieService.updateFromApi();
    }

    
    @Roles('user')
    @ApiOperation({summary: 'Get specific movie details'})
    @ApiBearerAuth('access-token')
    @ApiResponse({status: 200, description: 'The queried movie details', type: GetMovieDetailDto})
    @Get(':title')
    async getMovieByTitle(@Param('title') title: string) {
        return this.movieService.findByTitle(title);
    }
}
