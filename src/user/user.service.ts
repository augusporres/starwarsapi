import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UserService {

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
    async findOne(username: string): Promise<User | undefined> {
        return this.users.find(user => user.username == username);
    }
}
