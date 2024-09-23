import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from 'src/auth/entities/role-entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]),TypeOrmModule.forFeature([Role])],
  providers: [UserService],
  exports: [UserService],
  controllers: [UserController]
})
export class UserModule {}
