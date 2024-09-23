import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserDto } from 'src/user/dto/user.dto';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { NewUserDto } from './dto/new-user.dto';
import { Role } from './entities/role-entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
        it('should return a user and access token on successful login', async () => {
            const signInDto: UserDto = { username: 'testuser', password: 'password' };
            const result = { user: new User(), access_token: 'token' };
            const role: Role = {id: 1, role: 'user'}
            mockAuthService.signIn.mockResolvedValue(result);
            expect(await authController.signIn(signInDto)).toEqual(result);
            expect(mockAuthService.signIn).toHaveBeenCalledWith(signInDto.username, signInDto.password);
        });
        
        it('should throw an error if login fails', async () => {
            const signInDto: UserDto = { username: 'testuser', password: 'wrongpassword' };
            
            mockAuthService.signIn.mockRejectedValue(new UnauthorizedException);
            
            await expect(authController.signIn(signInDto)).rejects.toThrow(UnauthorizedException);
        });
    });
    
    describe('registerUser', () => {
        it('should register a new user with default role if none is provided', async () => {
            const newUserDto: NewUserDto = { username: 'newuser', password: 'password' };
            const createdUser = new User();
            createdUser.username = 'newuser';
            
            mockAuthService.create.mockResolvedValue(createdUser);
            
            const result = await authController.registerUser(newUserDto);
            
            expect(result).toEqual(createdUser);
            expect(mockAuthService.create).toHaveBeenCalledWith({ ...newUserDto, roles: 'user' });
        });
        
        it('should register a new user with provided roles', async () => {
            const newUserDto: NewUserDto = { username: 'newuser', password: 'password'};
            const createdUser = new User();
            createdUser.username = 'newuser';
            
            mockAuthService.create.mockResolvedValue(createdUser);
            
            const result = await authController.registerUser(newUserDto);
            
            expect(result).toEqual(createdUser);
            expect(mockAuthService.create).toHaveBeenCalledWith(newUserDto);
        });
    });
    
    
    //   describe('signIn', () => {
    //     it('should return a token when valid credentials are provided', async() => {
    //         const userDto: UserDto = { username: 'testuser', password: 'testpw' };
    //         const result = { access_token: 'test-token' };
    //         mockAuthService.signIn.mockResolvedValue(result)
    
    //         expect(await authController.signIn(userDto)).toBe(result);
    //         expect(mockAuthService.signIn).toHaveBeenCalledWith(userDto.username, userDto.password);
    //     })
    //     it('should throw an error when invalid credentials are provided', async() => {
    //         const userDto: UserDto = { username: 'testuser', password: 'wrongPw' };
    //         mockAuthService.signIn.mockRejectedValue(new UnauthorizedException())
    
    //         await expect(authController.signIn(userDto)).rejects.toThrow(UnauthorizedException);
    //     })
    //   });
});
