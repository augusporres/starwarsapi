import { ApiProperty } from "@nestjs/swagger";

export class NewUserDto {
    @ApiProperty({example: 'Pepe', description: 'The user name'})
    username: string;
    @ApiProperty({example: '*****', description: 'Your password'})
    password: string;
}