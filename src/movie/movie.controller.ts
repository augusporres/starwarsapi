import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { MovieService } from './movie.service';
import { Movie } from './interfaces/movie.interface';
import { CreateMovieDto } from './dto/create-movie.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public, Roles } from 'src/auth/constants';
import { GetMovieDto } from './dto/get-movie.dto';

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
}
