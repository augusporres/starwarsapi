import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { NewUserDto } from 'src/auth/dto/new-user.dto';
import { Role } from 'src/auth/entities/role-entity';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserService', () => {
  let userService: UserService;
  let roleRepository: Repository<Role>;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
            provide: getRepositoryToken(Role),
            useClass: Repository
        },
        {
            provide: getRepositoryToken(User),
            useClass: Repository
        },

    ],
    }).compile();

    userService = module.get<UserService>(UserService);
    roleRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('create', () => {
    it('should create new user', async() => {
        const newUser: NewUserDto = {
            username: 'testuser',
            password: 'asdfa'
        }
        const hashedPassword = 'hashedPassword'
        const userRole: Role = {id: 1, role: 'user'}
        const userEntity = {
            id: 1,
            username: newUser.username,
            roles: [userRole]
        } as User;

        jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword);
        jest.spyOn(roleRepository, 'findOne').mockResolvedValue(userRole);
        jest.spyOn(userRepository, 'create').mockReturnValue(userEntity);
        jest.spyOn(userRepository, 'save').mockResolvedValue(userEntity);

        const result = await userService.create(newUser);
        expect(bcrypt.hash).toHaveBeenCalledWith('asdfa', 10);
        expect(roleRepository.findOne).toHaveBeenCalledWith({
            where: {role: 'user'}
        });
        expect(userRepository.create).toHaveBeenCalledWith({
            username: newUser.username,
            password: hashedPassword,
            roles: [userRole]
        })
        expect(userRepository.save).toHaveBeenCalledWith(userEntity);
        expect(result).toBe(userEntity);
    })
  });
  describe('findOne', () => {
    it('should return a user by username', async () => {
        const username = 'testuser';
        const user = { id: 1, username, password: 'hashedpassword' } as User;
  
        jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
  
        const result = await userService.findOne(username);
  
        expect(result).toEqual(user);
        expect(userRepository.findOne).toHaveBeenCalledWith({
          where: { username },
        });
      });
  });
});
