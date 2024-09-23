import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/user/dto/user.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { Public } from './constants';
import { NewUserDto } from './dto/new-user.dto';
import { User } from 'src/user/entities/user.entity';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    
    @Public()
    @Post('login')
    @ApiBody({type: UserDto})
    signIn(@Body() signInDto: UserDto):  Promise<{
        user: User;
        access_token: string;
    }> {
        return this.authService.signIn(signInDto.username, signInDto.password);
    }
    
    @Public()
    @ApiOperation({summary: 'register new user'})
    @ApiResponse({status: 200, description: 'The created user', type: User})
    @ApiBody({type: NewUserDto})
    @Post('register')
    async registerUser(@Body() newUserDto: NewUserDto & {roles?: string}) : Promise<User> {
        if (!newUserDto.roles || newUserDto.roles.length === 0){
            newUserDto.roles = 'user';
        }
        return this.authService.create(newUserDto)
    }
}
