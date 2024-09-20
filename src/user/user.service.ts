import { Injectable } from '@nestjs/common';
// import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { CreateUserDto } from './dto/create-user.dto';

export type User = any;

@Injectable()
export class UserService {

    // constructor(@InjectModel(User.name) private userModel: Model<User>){}
    private readonly users = [
        {
            userId: 1,
            username: 'Augusto',
            password: '1234'
        },
        {
            userId: 2,
            username: 'Mariano',
            password: '4567'
        }
    ];
    // async create(createUserDto: CreateUserDto): Promise<User> {
    //     const createdUser = new this.userModel(createUserDto);
    //     return createdUser.save();
    // }

    // async findOne(username: string): Promise<User[] | undefined> {
    //     return this.userModel.find(user => user.username == username).exec();
    // }
    async findOne(username: string): Promise<User | undefined> {
        return this.users.find(user => user.username == username);
    }
}
