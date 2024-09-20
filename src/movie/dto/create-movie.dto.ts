import { ApiProperty } from '@nestjs/swagger';


export class CreateMovieDto {
    @ApiProperty({example: 'The revenge of the siths', description: 'The movie title'})
    title: string;
    @ApiProperty({example: '4', description: 'The episode number'})
    episodeId: number;
}