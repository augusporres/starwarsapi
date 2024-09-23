import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NewUserDto } from './dto/new-user.dto';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role-entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor (
        private userService: UserService, 
        private jwtService: JwtService){}

    async signIn(username: string, pass: string): Promise<{user: User,access_token: string}> {
        const user = await this.userService.findOne(username, { relations: ['roles'] });
        console.log(user)
        if (!user) throw new BadRequestException('Bad Credentials');
        const matchPassword = await bcrypt.compare(pass, user.password);
        if (!matchPassword) {
            console.log('not matching passwords')
            throw new UnauthorizedException();
        }
        
        const payload = {
            sub: user.id, 
            username: user.username,
            roles: user.roles.map(role => role.role)
        };

        delete user.password;
        // generat JWT Token and return token
        return {
            user,
            access_token: await this.jwtService.signAsync(payload),
        };
    }

    async create(newUser: NewUserDto): Promise<User> {
        return this.userService.create(newUser);
    }
}
