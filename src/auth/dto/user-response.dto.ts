import { ApiProperty } from "@nestjs/swagger";

export class UserResponseDto {
    @ApiProperty()
    username: string;
}