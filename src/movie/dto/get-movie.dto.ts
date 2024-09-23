import { ApiProperty } from '@nestjs/swagger';


export class GetMovieDto {
    @ApiProperty({example: 1, description: 'The movie id', type: Number})
    id: number;
    @ApiProperty({example: 'A new Hope', description: 'The movie title'})
    title: string;
    @ApiProperty({example: '4', description: 'The episode number'})
    episodeId: number;
    @ApiProperty({example: 'George Lucas', description: 'The movie director'})
    director: string;
    @ApiProperty({example: '1977-12-05', description: 'The release date of the movie'})
    releaseDate: Date;
}