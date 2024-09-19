import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { MovieController } from './movie/movie.controller';

@Module({
  imports: [],
  controllers: [AppController, UserController, MovieController],
  providers: [AppService],
})
export class AppModule {}
