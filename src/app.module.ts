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
import { MongooseModule } from '@nestjs/mongoose'

// import {dotenv} from 'dotenv'
import { MovieModule } from './movie/movie.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from './db/data-source';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot(
        dataSourceOptions
      ),
    AuthModule, UserModule,  MovieModule
  ],
  controllers: [AppController, UserController,  AuthController, MovieController],
  providers: [AppService],
})
export class AppModule {}
