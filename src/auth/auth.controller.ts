import { Body, Controller, Get, Post, UseGuards, Request, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/user/dto/user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { Public } from './constants';
import { NewUserDto } from './dto/new-user.dto';
import { User } from 'src/user/entities/user.entity';
import { SignInResponseDto } from './dto/signin-reponse.dto';
import { BadRequestDto } from './dto/bad-request.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { NewUserResponseDto } from './dto/new-user-response.dto';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    
    @Public()
    @Post('login')
    @ApiOperation({summary: 'sign in with user credentials'})
    @ApiResponse({status: 201, description: 'user logged in ok', type: SignInResponseDto})
    @ApiResponse({status: 400, description: 'credentials are wrong', type: BadRequestDto})
    @ApiBody({type: UserDto})
    async signIn(@Body() signInDto: UserDto):  Promise<SignInResponseDto> {
        const signInResponse = await this.authService.signIn(signInDto.username, signInDto.password);
        const userResponse = new UserResponseDto();
        userResponse.username = signInResponse.user.username;
        const response: SignInResponseDto = {
            user: userResponse,
            access_token: signInResponse.access_token,
            roles: signInResponse.user.roles.map(x => x.role)
        }
        return response;
    }
    
    @Public()
    @ApiOperation({summary: 'register new user'})
    @ApiResponse({status: 201, description: 'The registered user', type: NewUserResponseDto})
    @ApiBody({type: NewUserDto})
    @Post('register')
    async registerUser(@Body() newUserDto: NewUserDto) : Promise<NewUserResponseDto> {
        const createResponse = await this.authService.create(newUserDto);
        const response: NewUserResponseDto = {
            username: createResponse.username,
            roles: createResponse.roles.map(x => x.role)
        }
        return response;
    }
}
