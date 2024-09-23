import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { NewUserDto } from 'src/auth/dto/new-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { Role } from 'src/auth/entities/role-entity';


@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Role) private roleRepository: Repository<Role>
    ){}
    
    async findOne(username: string, options?: FindOneOptions<User>): Promise<User | undefined> {
        return await this.userRepository.findOne({
            where: { username },
            ...options
        });
    }

    async create(newUserDto: NewUserDto): Promise<User> {

        newUserDto.password = await bcrypt.hash(newUserDto.password, 10);
        
        
        const userRole = await this.roleRepository.findOne({
            where: { role: 'user' },
          });
        let user = this.userRepository.create({
            ...newUserDto,
            roles: [userRole]
          });
        user = await this.userRepository.save(user);
        delete user.password;
        return user;
    }
    
}
