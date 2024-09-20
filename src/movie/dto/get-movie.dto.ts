import { ApiProperty } from '@nestjs/swagger';


export class GetMovieDto {
    @ApiProperty({example: 'A new Hope', description: 'The movie title'})
    title: string;
    @ApiProperty({example: '4', description: 'The episode number'})
    episodeId: number;
}