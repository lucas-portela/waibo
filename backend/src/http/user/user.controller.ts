import { Controller, Get, Inject } from '@nestjs/common';
import { Public } from '../auth/auth.decorators';
import type { QueueService } from 'src/application/queue/ports/queue.service';
import { QUEUE_SERVICE } from 'src/application/queue/tokens';
import { UserDto } from 'src/application/user/dtos/user.dto';

@Controller('user')
export class UserController {
  constructor(
    @Inject(QUEUE_SERVICE)
    private readonly queueService: QueueService,
  ) {}

  @Get()
  findAll() {
    return ['Oi mundo!'];
  }

  @Public()
  @Get('queue')
  async publicEndpoint() {
    // await this.queueService.publish({
    //   topic: 'user.created',
    //   data: {
    //     id: '1',
    //     name: 'Lucas',
    //     username: 'lucasportela',
    //     password: '****',
    //     role: UserRole.ADMIN,
    //   },
    //   dto: UserDto,
    // });
  }

  async onModuleInit() {
    let n = 0;
    const { unsubscribe } = await this.queueService.subscribe({
      topic: 'user.created',
      dto: UserDto,
      async handler({ data, topic }) {
        console.log('Received data from subject', topic, data);
        n += 1;
        if (n >= 3) {
          await unsubscribe();
          console.log('Unsubscribed after 3 messages');
        }
      },
    });
  }
}
