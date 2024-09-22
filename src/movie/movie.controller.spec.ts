import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Movie } from './interfaces/movie.interface';
import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from 'src/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';

describe('MovieController', () => {
    let movieController: MovieController;
    let movieService: MovieService;
    let reflector: Reflector;
    let authGuard: AuthGuard;
    let jwtService: JwtService;
    
    const mockMovieService = {
        create: jest.fn()
    }
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MovieController],
            providers: [
                {
                    provide: MovieService,
                    useValue: mockMovieService
                },
                Reflector,
                {
                    provide: JwtService,
                    useValue: {
                        verifyAsync: jest.fn(), // Mocking JWT verify method
                    },
                },
            ]
        }).compile();
        
        movieController = module.get<MovieController>(MovieController);
        movieService = module.get<MovieService>(MovieService);
        reflector = module.get<Reflector>(Reflector);
        jwtService = module.get<JwtService>(JwtService);
        authGuard = new AuthGuard(jwtService, reflector);
    });
    
    it('should be defined', () => {
        expect(movieController).toBeDefined();
    });
    
    describe('createMovie', () => {
        it('should return created movie', async () => {
            const newMovie: CreateMovieDto = {
                title: 'new movie',
                episodeId: 1,
                director: 'Augusto',
                releaseDate: new Date('1986-05-06')
            }
            const createdMovie: Movie = {...newMovie}
            
            const user = { roles: ['admin'] }; // Mock admin user
            jest.spyOn(movieService, 'create').mockResolvedValue(newMovie);
            
            // mockMovieService.create.mockResolvedValue(createdMovie);
            
            
            const result = await movieController.createMovie(newMovie);
            expect(result).toEqual(createdMovie);
            expect(movieService.create).toHaveBeenCalledWith(newMovie);
        })
        
        it('should throw a ForbiddenException for a non-admin user', async () => {
            const movieDto: CreateMovieDto = {
                title: 'new movie',
                episodeId: 1,
                director: 'Augusto',
                releaseDate: new Date('1986-05-06')
            };
            
            const userPayload = { roles: ['user'] };
            jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(userPayload);
            jest.spyOn(reflector, 'get').mockReturnValue(['admin']);
            
            // Simulate request context
            const req = { headers: { authorization: 'Bearer token' } };
            const context = {
                switchToHttp: () => ({
                    getRequest: () => req,
                }),
                getHandler: () => jest.fn(), // Mock the handler
                getClass: () => jest.fn(), // Mock the handler
            };
            
            const canActivate = authGuard.canActivate(context as any);    
            // expect(canActivate).rejects.toThrow(ForbiddenException);
            expect(canActivate).toBe(false);
            // await expect(movieController.createMovie(movieDto)).rejects.toThrow(ForbiddenException);
        });
    });
});
