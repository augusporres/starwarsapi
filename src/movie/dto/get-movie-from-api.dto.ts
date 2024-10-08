import { ApiProperty } from '@nestjs/swagger';


export class GetMovieFromApiDto {
    @ApiProperty({example: 'The revenge of the siths', description: 'The movie title'})
    title: string;
    @ApiProperty({example: '4', description: 'The episode number'})
    episode: number;
    // @ApiProperty({example: 'It is a period of civil war...', description: 'The openinc phrase'})
    // opening_crawl: string;
    @ApiProperty({example: 'Robert D Jr', description: 'The director of the movie'})
    director: string;
    @ApiProperty({example: '1986-12-12', description: 'The date the movie was released'})
    releaseDate: Date;
}
