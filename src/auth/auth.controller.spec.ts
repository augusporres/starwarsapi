import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserDto } from 'src/user/dto/user.dto';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    signIn: jest.fn(),
    create: jest.fn()
  }
  const mockJwtService = {
    signAsync: jest.fn()
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
            provide: AuthService,
            useValue: mockAuthService
        } ,
        {
            provide: JwtService,
            useValue: mockJwtService
        }
      ]
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signIn', () => {
    it('should return a token when valid credentials are provided', async() => {
        const userDto: UserDto = { username: 'testuser', password: 'testpw' };
        const result = { access_token: 'test-token' };
        mockAuthService.signIn.mockResolvedValue(result)

        expect(await authController.signIn(userDto)).toBe(result);
        expect(mockAuthService.signIn).toHaveBeenCalledWith(userDto.username, userDto.password);
    })
    it('should throw an error when invalid credentials are provided', async() => {
        const userDto: UserDto = { username: 'testuser', password: 'wrongPw' };
        mockAuthService.signIn.mockRejectedValue(new UnauthorizedException())

        await expect(authController.signIn(userDto)).rejects.toThrow(UnauthorizedException);
    })
  });
});
