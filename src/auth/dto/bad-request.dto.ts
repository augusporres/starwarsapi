import { ApiProperty } from "@nestjs/swagger";

export class BadRequestDto {
    @ApiProperty({type: String, description: 'The error message'})
    message: string;
    @ApiProperty({type: String, description: 'The error'})
    error: string;
    @ApiProperty()
    statusCode: number;
}