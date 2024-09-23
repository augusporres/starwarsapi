import { ApiProperty } from "@nestjs/swagger";

export class GetMovieDetailDto {
    @ApiProperty({example: 1, description: 'The movie id', type: Number})
    id: number;
    @ApiProperty({example: 'The revenge of the siths', description: 'The movie title'})
    title: string;
    @ApiProperty({example: '4', description: 'The episode number'})
    episodeId: number;
    @ApiProperty({example: 'Robert D Jr', description: 'The director of the movie'})
    director: string;
    @ApiProperty({example: '1977-05-06', description: 'The release date of the movie'})
    releaseDate: Date;
}