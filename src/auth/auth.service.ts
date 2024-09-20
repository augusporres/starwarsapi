import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor (
        private userService: UserService, 
        private jwtService: JwtService){}

    async signIn(username: string, pass: string): Promise<{access_token: string}> {
        const user = await this.userService.findOne(username);
        if (user?.password !== pass) {
            throw new UnauthorizedException();
        }
        const payload = {
            sub: user._id, 
            username: user.username,
            roles: user.roles
        };
        // use bcrypt for hashing passwords

        // generat JWT Token and return token
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
