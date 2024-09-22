import { ApiProperty } from "@nestjs/swagger";

export class UpdateMovieDto {
    @ApiProperty({example: 'A new Hope', description: 'The movie title', required: false})
    title?: string;
    @ApiProperty({example: 'George Lucas', description: 'The movie director', required: false})
    director?: string;
    @ApiProperty({example: '1977-05-25', description: 'The release date', required: false})
    releaseDate?: Date;
}