import { Test, TestingModule } from '@nestjs/testing';
import { MovieService } from './movie.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { Movie } from './entities/movie-entity';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { NotFoundException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, of, throwError } from 'rxjs';
import { GetMovieDto } from './dto/get-movie.dto';
import { GetMovieDetailDto } from './dto/get-movie-detail.dto';

describe('MovieService', () => {
  let movieService: MovieService;
  let movieRepository: Repository<Movie>;
  let httpService: HttpService;

  const mockMovieRepository = {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  const mockHttpService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MovieService,
        {
          provide: getRepositoryToken(Movie),
          useValue: mockMovieRepository,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    movieService = module.get<MovieService>(MovieService);
    movieRepository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(movieService).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const result: Movie[] = [{ id: 1,title: 'Test Movie', episodeId: 1, director: 'Director', releaseDate: new Date() }];
      const serviceResult: GetMovieDto[] = [{ title: 'Test Movie', episodeId: 1, director: 'Director', releaseDate: new Date() }]
      jest.spyOn(movieRepository, 'find').mockResolvedValue(result);

      expect(await movieService.findAll()).toEqual(serviceResult);
    });
  });

  describe('findByEpisode', () => {
    it('should return a movie by episode', async () => {
      const movie: Movie = { id: 1, title: 'Test Movie', episodeId: 1, director: 'Director', releaseDate: new Date() };
      const serviceResp: GetMovieDetailDto = {title: 'Test Movie', episodeId: 1, director: 'Director', releaseDate: new Date()}
      jest.spyOn(movieRepository, 'findOneBy').mockResolvedValue(movie);

      expect(await movieService.findByEpisode(1)).toEqual(serviceResp);
    });

    it('should throw NotFoundException if movie does not exist', async () => {
      jest.spyOn(movieRepository, 'findOneBy').mockResolvedValue(null);

      await expect(movieService.findByEpisode(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a new movie', async () => {
      const createMovieDto: CreateMovieDto = { title: 'New Movie', episodeId: 2, director: 'Director', releaseDate: new Date() };
      const movie = { ...createMovieDto, id: 1 };
      jest.spyOn(movieRepository, 'create').mockReturnValue(movie);
      jest.spyOn(movieRepository, 'save').mockResolvedValue(movie);

      expect(await movieService.create(createMovieDto)).toEqual(movie);
    });
  });

  describe('updateFromApi', () => {
    it('should update movies from API', async () => {
      const apiMovies = [
        { title: 'API Movie 1', episode_id: 1, director: 'Director 1', release_date: '2023-01-01' },
        { title: 'API Movie 2', episode_id: 2, director: 'Director 2', release_date: '2023-01-02' },
      ];

      jest.spyOn(mockHttpService, 'get').mockReturnValue(of({ data: { results: apiMovies } }));

      jest.spyOn(movieRepository, 'findOneBy').mockResolvedValue(null);
      jest.spyOn(movieRepository, 'create').mockImplementation((movie: DeepPartial<Movie>): Movie => {
        return {
            id: 1, // Dummy ID
            episodeId: movie.episodeId!,
            title: movie.title!,
            director: movie.director!,
            releaseDate: movie.releaseDate, // Ensure it's a Date object
        } as Movie; // Cast to Movie type
    });
      jest.spyOn(movieRepository, 'save').mockResolvedValue(undefined);

      const result = await movieService.updateFromApi();
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({ title: 'API Movie 1', episode: 1, director: 'Director 1', releaseDate: '2023-01-01' });
    });

    it('should throw an error if fetching movies fails', async () => {
        jest.spyOn(mockHttpService, 'get').mockReturnValue(throwError(() => new Error('Failed to fetch')));

        await expect(movieService.updateFromApi()).rejects.toThrow('Failed to fetch movies from the external API');
    });
  });

  describe('updateByEpisode', () => {
    it('should update a movie by episode', async () => {
      const episode = 1;
      const updateMovieDto: UpdateMovieDto = { title: 'Updated Movie', director: 'Updated Director' };
      const movieFromDb: Movie = { 
          id: 1, 
          episodeId: episode, 
          releaseDate: new Date(),
          title: updateMovieDto.title,
          director: updateMovieDto.director
        };

      jest.spyOn(movieRepository, 'findOneBy').mockResolvedValue(movieFromDb);
      jest.spyOn(movieRepository, 'save').mockResolvedValue(movieFromDb);
        delete movieFromDb.id
      expect(await movieService.updateByEpisode(episode, updateMovieDto)).toEqual(movieFromDb);
    });

    it('should throw NotFoundException if movie does not exist', async () => {
      jest.spyOn(movieRepository, 'findOneBy').mockResolvedValue(null);

      await expect(movieService.updateByEpisode(1, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteByEpisode', () => {
    it('should delete a movie by episode', async () => {
        
      jest.spyOn(movieRepository, 'delete').mockResolvedValue({ affected: 1, raw: {} });

      await expect(movieService.deleteByEpisode(1)).resolves.toEqual("Movie successfully deleted");
    });

    it('should throw NotFoundException if movie does not exist', async () => {
      jest.spyOn(movieRepository, 'delete').mockResolvedValue({ affected: 0, raw: {} });

      await expect(movieService.deleteByEpisode(1)).rejects.toThrow(NotFoundException);
    });
  });
});
