import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { AuthModule } from 'src/application/auth/auth.module';
import { UserModule } from 'src/application/user/user.module';

@Module({
  imports: [AuthModule, UserModule],
  controllers: [UserController],
})
export class UserHttpModule {}
