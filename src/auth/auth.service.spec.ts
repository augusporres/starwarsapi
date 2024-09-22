import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import { NewUserDto } from './dto/new-user.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;

  const mockUserService = {
    findOne: jest.fn(),
    create: jest.fn()
  }
  const mockJwtService = {
    signAsync: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
            provide: JwtService,
            useValue: mockJwtService
        },
        {
            provide: UserService,
            useValue: mockUserService
        }
    ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signIn', () => {
    it('should return access token when credentials are provided right', async () => {
        const username = "test"
        const password = "pass"
        const user: User  = {
            username: username,
            password: "pass",
            roles: ["user"],
            _id: Object('id')
        };
        mockUserService.findOne.mockResolvedValue(user);
        mockJwtService.signAsync.mockResolvedValue('test-token');

        const result = await authService.signIn(username, password);

        expect(result).toEqual({access_token: 'test-token'});
        expect(mockUserService.findOne).toHaveBeenCalledWith(username);
        expect(mockJwtService.signAsync).toHaveBeenCalledWith({
            sub: user._id,
            username: user.username,
            roles: user.roles
        });
    });
    it('should return unauthorized when credentials are provided wrong', async () => {
        const username = "test"
        const password = "wrongPass"
        const user: User  = {
            username: username,
            password: "pass",
            roles: ["user"],
            _id: Object('id')
        };
        mockUserService.findOne.mockResolvedValue(user);
        mockJwtService.signAsync.mockResolvedValue('test-token');

        ;

        await expect(authService.signIn(username, password)).rejects.toThrow(UnauthorizedException);
        expect(mockUserService.findOne).toHaveBeenCalledWith(username);
    });

    it('should create a new user', async () => {
        const user: NewUserDto = {
            username: "test",
            password: "pass",
            roles: ["admin"]
        }
        const userRet: User = {
            username: user.username,
            password: user.password,
            roles: user.roles,
            _id: Object('id')
        }
        mockUserService.create.mockResolvedValue(userRet);
        const result = await authService.create(user)
        expect(result).toEqual(userRet);
        expect(mockUserService.create).toHaveBeenCalledWith(user);
    })
  });
});
