import { Global, Module } from '@nestjs/common';
import { QUEUE_SERVICE } from 'src/application/queue/tokens';
import { RabbitMQService } from './rabbitmq.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: QUEUE_SERVICE,
      useClass: RabbitMQService,
    },
  ],
  exports: [QUEUE_SERVICE],
})
export class RabbitMQModule {}
