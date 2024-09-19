import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Module({
  imports: [
      UserModule,
      JwtModule.register({
        global: true, // for not having to import it in every module
        secret: jwtConstants.secret,
        signOptions: {expiresIn: '60s'}
      }),

    ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
