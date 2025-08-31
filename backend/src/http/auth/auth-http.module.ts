import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from 'src/application/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AuthController],
  providers: [{ provide: APP_GUARD, useClass: AuthGuard }],
  exports: [],
})
export class AuthHttpModule {}
