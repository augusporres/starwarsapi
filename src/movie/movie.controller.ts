import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { MovieService } from './movie.service';
import { Movie } from './interfaces/movie.interface';
import { CreateMovieDto } from './dto/create-movie.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public, Roles } from 'src/auth/constants';
import { GetMovieDto } from './dto/get-movie.dto';
import { GetMovieDetailDto } from './dto/get-movie-detail.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { GetMovieFromApiDto } from './dto/get-movie-from-api.dto';

@ApiTags('Movies')
@Controller('movies')
export class MovieController {
    constructor(private readonly movieService: MovieService){}

    @Roles('admin')
    @ApiOperation({summary: 'Create new movie'})
    @ApiResponse({status: 200, description: 'The created movie', type: CreateMovieDto})
    @ApiResponse({status: 401, description: 'Not authorized for this method'})
    @ApiBearerAuth('access-token')  
    @ApiBody({type: CreateMovieDto})
    @Post('create')
    async createMovie(@Body() movie: CreateMovieDto) {
        return this.movieService.create(movie);
    }
    
    @Roles('admin', 'user')
    @ApiOperation({summary: 'Get all movies'})
    @ApiBearerAuth('access-token')
    @ApiResponse({status: 200, description: 'All the available movies', type: [GetMovieDto]})
    @Get('all')
    async get() {
        return this.movieService.findAll();
    }
    
    @Roles('admin')
    @ApiOperation({summary: 'Update movie by episode id'})
    @ApiResponse({status: 200, description: 'Movie updated successfully'})
    @ApiResponse({status: 401, description: 'Not authorized for this method'})
    @ApiBearerAuth('access-token')  
    @Put('update/:episode')
    async updateMovieByEpisode(
        @Param('episode') episode: number,
        @Body() updateMovieDto: UpdateMovieDto
    ): Promise<UpdateMovieDto> {
        return this.movieService.updateByEpisode(episode, updateMovieDto);
    }
    @Roles('admin')
    @ApiOperation({summary: 'Update movies from API'})
    @ApiResponse({status: 200, description: 'Movies updated from api successfully'})
    @ApiResponse({status: 401, description: 'Not authorized for this method'})
    @ApiBearerAuth('access-token')  
    @Get('updateFromApi')
    async updateMovies(): Promise<GetMovieFromApiDto[]>{
        return this.movieService.updateFromApi();
    }

    
    @Roles('user')
    @ApiOperation({summary: 'Get specific movie details by episode id'})
    @ApiBearerAuth('access-token')
    @ApiResponse({status: 200, description: 'The queried movie details', type: GetMovieDetailDto})
    @Get(':episode')
    async getMovieByTitle(@Param('episode') episode: number): Promise<GetMovieDetailDto> {
        return this.movieService.findByEpisode(episode);
        
    }
    
    @Roles('admin')
    @ApiOperation({summary: 'Delete movie by episode'})
    @ApiBearerAuth('access-token')
    @ApiResponse({status: 200, description: 'The movie was deleted successfully'})
    @Delete(':episode')
    async deleteMovieByEpisode(@Param('episode') episode: number): Promise<string> {
        return this.movieService.deleteByEpisode(episode);
        
    }
}
