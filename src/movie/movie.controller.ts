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
        const response =  await this.movieService.create(movie);
        delete response.id
        return response;
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
    @Put('update/:id')
    async updateMovieById(
        @Param('id') id: number,
        @Body() updateMovieDto: UpdateMovieDto
    ): Promise<UpdateMovieDto> {
        return this.movieService.updateById(id, updateMovieDto);
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
    @ApiOperation({summary: 'Get specific movie details by id'})
    @ApiBearerAuth('access-token')
    @ApiResponse({status: 200, description: 'The queried movie details', type: GetMovieDetailDto})
    @ApiResponse({status: 404, description: 'The queried movie was not found'})
    @Get(':id')
    async getMovieById(@Param('id') id: number): Promise<GetMovieDetailDto> {
        return this.movieService.findById(id);
        
    }
    
    @Roles('admin')
    @ApiOperation({summary: 'Delete movie by id'})
    @ApiBearerAuth('access-token')
    @ApiResponse({status: 200, description: 'The movie was deleted successfully'})
    @Delete(':id')
    async deleteMovieById(@Param('id') id: number): Promise<string> {
        return this.movieService.deleteById(id);
        
    }
}
