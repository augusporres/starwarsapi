import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { NewUserDto } from 'src/auth/dto/new-user.dto';


@Injectable()
export class UserService {

    constructor(@InjectModel(User.name) private userModel: Model<User>){}
    
    // async create(createUserDto: CreateUserDto): Promise<User> {
    //     const createdUser = new this.userModel(createUserDto);
    //     return createdUser.save();
    // }

    async findOne(username: string): Promise<User | undefined> {
        return await this.userModel.findOne({username}).exec();
    }

    async create(newUserDto: NewUserDto): Promise<User> {
        // const hashedPassword = await bcrypt.hash(newUserDto.password, 10);

        const newUser = new this.userModel({
            username: newUserDto.username,
            password: newUserDto.password,
            roles: newUserDto.roles
        });
        return newUser.save();
    }
    
}
