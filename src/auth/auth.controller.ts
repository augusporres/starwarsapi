import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/user/dto/user.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    
    @Post('login')
    @ApiBody({type: UserDto})
    signIn(@Body() signInDto: Record<string, any>) {
        return this.authService.signIn(signInDto.username, signInDto.password);
    }
}
