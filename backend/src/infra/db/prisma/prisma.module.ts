import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { UserPrismaRepository } from './repositories/user-prisma-repository';
import { USER_REPOSITORY } from 'src/application/user/tokens';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: USER_REPOSITORY,
      useClass: UserPrismaRepository,
    },
  ],
  exports: [PrismaService, USER_REPOSITORY],
})
export class PrismaModule {}
