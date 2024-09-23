import { ApiProperty } from "@nestjs/swagger";

export class NewUserResponseDto {
    @ApiProperty({example: 'Pepe', description: 'The user name'})
    username: string;
    @ApiProperty({example: ['admin'], description: 'the role for the user', type: [String]})
    roles: string[];
}