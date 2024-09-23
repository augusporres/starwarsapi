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
import { NewUserResponseDto } from './dto/new-user-response.dto';
import { SignInResponseDto } from './dto/signin-reponse.dto';

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
            const mockUser: User = {
                id: 1,
                username: 'testuser',
                password: 'hashedPassword',
                roles: [{ id: 1, role: 'user' }], // Assume role entity with id and role
            };
            const mockSignInResponse = {
                user: mockUser,
                access_token: 'mockAccessToken',
            };
            const expectedResponse: SignInResponseDto = {
                user: { username: 'testuser' },
                access_token: 'mockAccessToken',
                roles: ['user'],  // Mapping roles from user
            };
            mockAuthService.signIn.mockResolvedValue(mockSignInResponse);
            expect(await authController.signIn(signInDto)).toEqual(expectedResponse);
            expect(mockAuthService.signIn).toHaveBeenCalledWith(signInDto.username, signInDto.password);
        });
        
        it('should throw an error if login fails', async () => {
            const signInDto: UserDto = { username: 'testuser', password: 'wrongpassword' };
            
            mockAuthService.signIn.mockRejectedValue(new UnauthorizedException);
            
            await expect(authController.signIn(signInDto)).rejects.toThrow(UnauthorizedException);
        });
    });
    
    describe('registerUser', () => {
        it('should register a new user with user role', async () => {
            const newUserDto: NewUserDto = { username: 'newuser', password: 'password' };
            const mockUser: User = {
                id: 1,
                username: 'testuser',
                password: 'hashedPassword',
                roles: [{ id: 1, role: 'user' }], // Assume role entity with id and role
            };
            const mockUserResponse = new NewUserResponseDto();
            mockUserResponse.username = mockUser.username;
            mockUserResponse.roles = ['user']
            
            mockAuthService.create.mockResolvedValue(mockUser);
            
            const result = await authController.registerUser(newUserDto);
            
            expect(result).toEqual(mockUserResponse);
            expect(mockAuthService.create).toHaveBeenCalledWith(newUserDto);
        });
        
    });
});
