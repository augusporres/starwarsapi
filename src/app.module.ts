import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { MovieController } from './movie/movie.controller';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserService } from './user/user.service';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [AuthModule, UserModule, AuthModule],
  controllers: [AppController, UserController, MovieController, AuthController],
  providers: [AppService, UserService, AuthService],
})
export class AppModule {}
