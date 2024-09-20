import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/user/dto/user.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './auth.guard';
import { Public } from './constants';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    
    @Public()
    @Post('login')
    @ApiBody({type: UserDto})
    signIn(@Body() signInDto: UserDto) {
        return this.authService.signIn(signInDto.username, signInDto.password);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user
    }
}
