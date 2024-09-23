import { ApiProperty } from "@nestjs/swagger";
import { UserResponseDto } from "./user-response.dto";

export class SignInResponseDto {
    @ApiProperty({type: UserResponseDto})
    user: UserResponseDto
    @ApiProperty({type: String})
    access_token: string;
    @ApiProperty({type: [String]})
    roles: string[];
}