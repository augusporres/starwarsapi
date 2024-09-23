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
            updateByEpisode: jest.fn(),
            updateFromApi: jest.fn(),
            findByEpisode: jest.fn(),
            deleteByEpisode: jest.fn(),
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
        { title: 'Test Movie', 
            episodeId: 1, 
            director: 'Director', 
            releaseDate: new Date() 
        }
    ];
      jest.spyOn(movieService, 'findAll').mockResolvedValue(result);

      expect(await movieController.get()).toEqual(result);
    });
  });

  describe('updateMovieByEpisode', () => {
    it('should update movie by episode id', async () => {
      const updateMovieDto: UpdateMovieDto = { title: 'Updated Movie', director: 'New Director' };
      const returnValue: Movie = {
        id: 1,
        episodeId: 1,
        title: updateMovieDto.title,
        director: updateMovieDto.director,
        releaseDate: new Date()
      }
      jest.spyOn(movieService, 'updateByEpisode').mockResolvedValue(returnValue);

      await expect(movieController.updateMovieByEpisode(1, updateMovieDto)).resolves.toBe(returnValue);
      expect(movieService.updateByEpisode).toHaveBeenCalledWith(1, updateMovieDto);
    });
  });

  describe('deleteMovieByEpisode', () => {
    it('should delete movie by episode', async () => {
        const sucessString: string = "Movie successfully deleted"
      jest.spyOn(movieService, 'deleteByEpisode').mockResolvedValue(sucessString);

      await expect(movieController.deleteMovieByEpisode(1)).resolves.toBe(sucessString);
      expect(movieService.deleteByEpisode).toHaveBeenCalledWith(1);
    });
  });
});
