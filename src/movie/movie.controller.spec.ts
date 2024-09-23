import { Test, TestingModule } from '@nestjs/testing';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { UnauthorizedException } from '@nestjs/common';
import { Movie } from './entities/movie-entity';
import { GetMovieDto } from './dto/get-movie.dto';

describe('MovieController', () => {
  let movieController: MovieController;
  let movieService: MovieService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MovieController],
      providers: [
        {
          provide: MovieService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            updateById: jest.fn(),
            updateFromApi: jest.fn(),
            findById: jest.fn(),
            deleteById: jest.fn(),
          },
        },
      ],
    }).compile();

    movieController = module.get<MovieController>(MovieController);
    movieService = module.get<MovieService>(MovieService);
  });

  it('should be defined', () => {
    expect(movieController).toBeDefined();
  });

  describe('createMovie', () => {
    it('should create a new movie', async () => {
      const createMovieDto: CreateMovieDto = { title: 'Test Movie', episodeId: 1, director: 'Director', releaseDate: new Date() };
      const retValue: Movie = {
        id: 1,
        ...createMovieDto}
      jest.spyOn(movieService, 'create').mockResolvedValue(retValue);

      const result = await movieController.createMovie(createMovieDto);
      expect(result).toEqual(retValue);
      expect(movieService.create).toHaveBeenCalledWith(createMovieDto);
    });

    it('should throw UnauthorizedException if user does not have admin role', async () => {
      // Simulate a user without the 'admin' role
      jest.spyOn(movieService, 'create').mockImplementation(() => {
        throw new UnauthorizedException();
      });

      const createMovieDto: CreateMovieDto = { title: 'Test Movie', episodeId: 1, director: 'Director', releaseDate: new Date() };

      await expect(movieController.createMovie(createMovieDto)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('get', () => {
    it('should return all movies', async () => {
      const result: GetMovieDto[] = [
        { 
            id: 1,
            title: 'Test Movie', 
            episodeId: 1, 
            director: 'Director', 
            releaseDate: new Date() 
        }
    ];
      jest.spyOn(movieService, 'findAll').mockResolvedValue(result);

      expect(await movieController.get()).toEqual(result);
    });
  });

  describe('updateMovieById', () => {
    it('should update movie by id', async () => {
      const updateMovieDto: UpdateMovieDto = { 
        title: 'Updated Movie', 
        director: 'New Director',
        episodeId: 1
    };
      const returnValue: UpdateMovieDto = {
        episodeId: 1,
        title: updateMovieDto.title,
        director: updateMovieDto.director,
        releaseDate: new Date()
      }
      jest.spyOn(movieService, 'updateById').mockResolvedValue(returnValue);

      await expect(movieController.updateMovieById(1, updateMovieDto)).resolves.toBe(returnValue);
      expect(movieService.updateById).toHaveBeenCalledWith(1, updateMovieDto);
    });
  });

  describe('deleteMovieById', () => {
    it('should delete movie by id', async () => {
        const sucessString: string = "Movie successfully deleted"
      jest.spyOn(movieService, 'deleteById').mockResolvedValue(sucessString);

      await expect(movieController.deleteMovieById(1)).resolves.toBe(sucessString);
      expect(movieService.deleteById).toHaveBeenCalledWith(1);
    });
  });
});
