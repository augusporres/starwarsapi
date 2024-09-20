import { Controller, Post, Param, Body } from '@nestjs/common';

// @ApiTags('Users')
@Controller('user')
export class UserController {
    constructor(){}

    // @Public()
    // @ApiOperation({summary: 'register new user'})
    // @ApiResponse({status: 200, description: 'The created user', type: String})
    // @ApiBody({type: CreateUserDto})
    // @Post('register')
    // registerUser(@Body() createUserdto: CreateUserDto) {
    //     return `user ${createUserdto.username} registered with password ${createUserdto.password}`
    // }
    
    // @ApiOperation({summary: 'login with user credentials'})
    // @ApiResponse({status: 200, description: 'login was succesful', type: String})
    // @ApiBody({type: UserDto})
    // @Post('login')
    // loginUser(@Body() userdto: UserDto) {
    //     return `user ${userdto.username} logged in with password ${userdto.password}`
    // }
}


