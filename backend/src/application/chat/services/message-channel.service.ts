import { Inject, Injectable } from '@nestjs/common';
import type { MessageChannelRepository } from 'src/domain/chat/repositories/message-channel.repository';
import type { BotRepository } from 'src/domain/bot/repositories/bot.repository';
import type {
  QueueService,
  QueueSubscription,
  QueueSubscriptionHandler,
} from 'src/application/queue/ports/queue.service';
import type { UserRepository } from 'src/domain/user/repositories/user.repository';
import { QUEUE_SERVICE } from 'src/application/queue/tokens';
import { USER_REPOSITORY } from 'src/application/user/tokens';
import { CreateMessageChannelDto } from '../dtos/create-message-channel.dto';
import _ from 'lodash';
import { MessageChannelTypeNotAvailableError } from 'src/core/error/message-channel-=type-not-available.error';
import { MESSAGE_CHANNEL_REPOSITORY } from '../tokens';
import {
  MessageChannelEntity,
  MessageChannelStatus,
} from 'src/domain/chat/entities/message-channel.entity';
import { BOT_REPOSITORY } from 'src/application/bot/tokens';
import { BotNotFoundError } from 'src/core/error/bot-not-found.error';
import { UserNotFoundError } from 'src/core/error/user-not-found.error';
import {
  MESSAGE_CHANNEL_CREATED,
  MESSAGE_CHANNEL_PAIRING_CODE as MESSAGE_CHANNEL_PAIRING_DATA,
  MESSAGE_CHANNEL_REQUEST_PAIRING,
} from '../topics';
import { MessageChannelDto } from '../dtos/message-channel.dto';
import { MessageChannelNotFoundError } from 'src/core/error/message-channel-not-found.error';
import { PairingDataDto } from '../dtos/pairing-data.dto';
import { PairingRequestTimedoutError } from 'src/core/error/pairing-request-timedout.error.';

export type AvailableChannelType = { id: string; name: string };

@Injectable()
export class MessageChannelService {
  private readonly _availableChannelTypes: AvailableChannelType[] = [];

  constructor(
    @Inject(QUEUE_SERVICE) private readonly queueService: QueueService,
    @Inject(USER_REPOSITORY) private readonly userRepository: UserRepository,
    @Inject(MESSAGE_CHANNEL_REPOSITORY)
    private readonly messageChannelRepository: MessageChannelRepository,
    @Inject(BOT_REPOSITORY) private readonly botRepository: BotRepository,
  ) {}

  getAvailableChannelTypes(): AvailableChannelType[] {
    return _.cloneDeep(this._availableChannelTypes);
  }

  registerChannelType(id: string, name: string) {
    if (!this._availableChannelTypes.find((channel) => channel.id === id)) {
      this._availableChannelTypes.push({ id, name });
    }
  }

  async create(data: CreateMessageChannelDto): Promise<MessageChannelDto> {
    await this._validateChannelBindings(data);

    const channel = await this.messageChannelRepository.create({
      botId: data.botId,
      contact: data.contact,
      name: data.name,
      type: data.type,
      userId: data.userId,
      status: MessageChannelStatus.DISCONNECTED,
    });

    const channelDto = MessageChannelDto.parse(channel);

    await this.queueService.publish({
      topic: MESSAGE_CHANNEL_CREATED(data.type),
      data: channelDto,
      dto: MessageChannelDto,
    });

    return channelDto;
  }

  async bindSession(
    channelId: string,
    sessionId: string,
  ): Promise<MessageChannelDto> {
    const channel = await this.messageChannelRepository.findById(channelId);
    if (!channel) {
      throw new MessageChannelNotFoundError(channelId);
    }

    const updatedChannel = await this.messageChannelRepository.update(
      channelId,
      {
        sessionId,
      },
    );

    return MessageChannelDto.parse(updatedChannel);
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

  async requestPairing(channelId: string): Promise<PairingDataDto> {
    const channel = await this.messageChannelRepository.findById(channelId);
    if (!channel) {
      throw new MessageChannelNotFoundError(channelId);
    }

    const channelDto = MessageChannelDto.parse(channel);
    await this._validateChannelBindings(channel);

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

  async findById(channelId: string): Promise<MessageChannelDto> {
    const channel = await this.messageChannelRepository.findById(channelId);
    if (!channel) {
      throw new MessageChannelNotFoundError(channelId);
    }
    return MessageChannelDto.parse(channel);
  }

  async findByUserId(userId: string): Promise<MessageChannelDto[]> {
    const channels = await this.messageChannelRepository.findByUserId(userId);
    return channels.map((channel) => MessageChannelDto.parse(channel));
  }

  async delete(channelId: string): Promise<void> {
    await this.messageChannelRepository.delete(channelId);
  }

  // Helpers
  private async _validateChannelBindings(
    data: Pick<MessageChannelEntity, 'type' | 'botId' | 'userId'>,
  ) {
    const channelTypeIsAvailable = this._availableChannelTypes.some(
      (channel) => channel.id === data.type,
    );
    if (!channelTypeIsAvailable) {
      throw new MessageChannelTypeNotAvailableError(data.type);
    }

    const bot = await this.botRepository.findById(data.botId);
    if (!bot) {
      throw new BotNotFoundError(data.botId);
    }

    const user = await this.userRepository.findById(data.userId);
    if (!user) {
      throw new UserNotFoundError(data.userId);
    }
  }
}
