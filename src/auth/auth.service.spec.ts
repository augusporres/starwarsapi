import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { NewUserDto } from './dto/new-user.dto';
import { User } from 'src/user/entities/user.entity';
import { Role } from './entities/role-entity';

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
            const userRoles: Role = {
                id: 1,
                role: 'user'
            }
            const user: User  = {
                id: 1,
                username: username,
                password: password,
                roles: [userRoles]
            };
            mockUserService.findOne.mockResolvedValue(user);
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
            mockJwtService.signAsync.mockResolvedValue('test-token');
            
            const result = await authService.signIn(username, password);
            
            expect(result).toEqual({user,access_token: 'test-token'});
            expect(mockUserService.findOne).toHaveBeenCalledWith(username, { relations: ['roles'] });
            expect(mockJwtService.signAsync).toHaveBeenCalledWith({
                sub: user.id,
                username: user.username,
                roles: ['user']
            });
        });
        it('should return unauthorized when credentials are provided wrong', async () => {
            const username = "test"
            const password = "wrongPass"
            const userRoles: Role = {
                id: 1,
                role: 'user'
            }
            const user: User  = {
                id: 1,
                username: username,
                password: "pass",
                roles: [userRoles],                
            };
            mockUserService.findOne.mockResolvedValue(user);
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(false); // Simulate password mismatch
            
            await expect(authService.signIn(username, password)).rejects.toThrow(UnauthorizedException);
        });
    });
    describe('create', () => {
        
        it('should create a new user', async () => {
            const user: NewUserDto = {
                username: "test",
                password: "pass",
                // roles: ["admin"]
            }
            const userRoles: Role = {
                id: 1,
                role: 'user'
            }
            const userRet: User = {
                id: 1,
                username: user.username,
                password: user.password,
                roles: [userRoles],
                // _id: Object('id')
            }
            mockUserService.create.mockResolvedValue(userRet);
            const result = await authService.create(user)
            expect(result).toEqual(userRet);
            expect(mockUserService.create).toHaveBeenCalledWith(user);
        })
    });
    
    
});
