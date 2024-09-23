import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role-entity';

@Module({
  imports: [
      UserModule,
      JwtModule.register({
        global: true, // for not having to import it in every module
        secret: jwtConstants.secret,
        signOptions: {expiresIn: '30m'}
      }),
      TypeOrmModule.forFeature([Role])
    ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    },
    AuthService
  ],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
