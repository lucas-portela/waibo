import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from 'src/application/user/services/user.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
