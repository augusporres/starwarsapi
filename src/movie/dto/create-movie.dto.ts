import { ApiProperty } from '@nestjs/swagger';


export class CreateMovieDto {
    @ApiProperty({example: 'The revenge of the siths', description: 'The movie title'})
    title: string;
    @ApiProperty({example: '4', description: 'The episode number'})
    episodeId: number;
    @ApiProperty({example: 'George Lucas', description: 'The movie director'})
    director: string;
    @ApiProperty({example: '1977-12-01', description: 'The movie release date'})
    releaseDate: Date;
}