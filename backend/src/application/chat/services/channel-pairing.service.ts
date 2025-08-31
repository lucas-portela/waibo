import type {
  QueueService,
  QueueSubscription,
  QueueSubscriptionHandler,
} from 'src/application/queue/ports/queue.service';
import {
  MESSAGE_CHANNEL_PAIRING_DATA as MESSAGE_CHANNEL_PAIRING_DATA,
  MESSAGE_CHANNEL_REQUEST_PAIRING,
  MESSAGE_CHANNEL_UNPAIR,
} from '../topics';
import { MessageChannelDto } from '../dtos/message-channel.dto';
import { MessageChannelNotFoundError } from 'src/core/error/message-channel-not-found.error';
import { PairingDataDto } from '../dtos/pairing-data.dto';
import { PairingRequestTimedoutError } from 'src/core/error/pairing-request-timedout.error.';
import { Inject } from '@nestjs/common';
import { QUEUE_SERVICE } from 'src/application/queue/tokens';
import type { MessageChannelRepository } from 'src/domain/chat/repositories/message-channel.repository';
import { MESSAGE_CHANNEL_REPOSITORY } from '../tokens';

export class ChannelPairingService {
  constructor(
    @Inject(QUEUE_SERVICE) private readonly queueService: QueueService,
    @Inject(MESSAGE_CHANNEL_REPOSITORY)
    private readonly messageChannelRepository: MessageChannelRepository,
  ) {}

  async requestPairing(channelId: string): Promise<PairingDataDto> {
    const channel = await this.messageChannelRepository.findById(channelId);
    if (!channel) {
      throw new MessageChannelNotFoundError(channelId);
    }

    const channelDto = MessageChannelDto.parse(channel);

    const pairingData = await this.queueService.once<PairingDataDto>({
      topic: MESSAGE_CHANNEL_PAIRING_DATA({
        channelType: channel.type,
        channelId: channel.id,
      }),
      timeout: 60000, // 60 seconds
      dto: PairingDataDto,
      afterSubscribe: async () => {
        await this.queueService.publish({
          topic: MESSAGE_CHANNEL_REQUEST_PAIRING(channel.type),
          data: channelDto,
          dto: MessageChannelDto,
        });
      },
    });

    if (!pairingData) {
      throw new PairingRequestTimedoutError();
    }

    return pairingData;
  }

  async onPairingRequest({
    channelType,
    handler,
  }: {
    channelType: string;
    handler: QueueSubscriptionHandler<MessageChannelDto>;
  }): Promise<QueueSubscription> {
    return this.queueService.subscribe({
      topic: MESSAGE_CHANNEL_REQUEST_PAIRING(channelType),
      dto: MessageChannelDto,
      handler,
    });
  }

  async sendPairingData(pairingData: PairingDataDto) {
    await this.queueService.publish({
      topic: MESSAGE_CHANNEL_PAIRING_DATA({
        channelType: pairingData.channelType,
        channelId: pairingData.channelId,
      }),
      data: pairingData,
      dto: PairingDataDto,
    });
  }

  async bindSession({
    channelId,
    sessionId,
  }: {
    channelId: string;
    sessionId: string;
  }): Promise<MessageChannelDto> {
    const channel = await this.messageChannelRepository.findById(channelId);
    if (!channel) {
      throw new MessageChannelNotFoundError(channelId);
    }

    const updatedChannel = await this.messageChannelRepository.update(
      channel.id,
      {
        sessionId,
      },
    );

    return MessageChannelDto.parse(updatedChannel);
  }

  async unpair(channelId: string): Promise<MessageChannelDto> {
    const channel = await this.messageChannelRepository.findById(channelId);
    if (!channel) {
      throw new MessageChannelNotFoundError(channelId);
    }

    await this.queueService.publish({
      topic: MESSAGE_CHANNEL_UNPAIR(channel.type),
      data: MessageChannelDto.parse(channel),
      dto: MessageChannelDto,
    });

    const updatedChannel = await this.messageChannelRepository.update(
      channel.id,
      {
        sessionId: null,
      },
    );

    return MessageChannelDto.parse(updatedChannel);
  }

  async onUnpair({
    channelType,
    handler,
  }: {
    channelType: string;
    handler: QueueSubscriptionHandler<MessageChannelDto>;
  }) {
    return this.queueService.subscribe({
      topic: MESSAGE_CHANNEL_REQUEST_PAIRING(channelType),
      dto: MessageChannelDto,
      handler,
    });
  }
}
