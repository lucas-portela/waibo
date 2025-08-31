import { Inject, Injectable } from '@nestjs/common';
import type { MessageChannelRepository } from 'src/domain/chat/repositories/message-channel.repository';
import type { BotRepository } from 'src/domain/bot/repositories/bot.repository';
import type {
  QueueService,
  QueueSubscription,
  QueueSubscriptionHandler,
} from 'src/application/queue/ports/queue.service';
import { QUEUE_SERVICE } from 'src/application/queue/tokens';
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
import { MessageChannelDto } from '../dtos/message-channel.dto';
import { MessageChannelNotFoundError } from 'src/core/error/message-channel-not-found.error';
import {
  MESSAGE_CHANNEL_INPUT_EVENT,
  MESSAGE_CHANNEL_OUTPUT_EVENT,
  MESSAGE_CHANNEL_STATUS_UPDATE,
} from '../topics';
import { UpdateMessageChannelDetailsDto } from '../dtos/update-message-channel-details.dto';
import { UserService } from 'src/application/user/services/user.service';
import { ChannelPairingService } from './channel-pairing.service';
import { MessageChannelOutputEventDto } from '../dtos/message-channel-output-event.dto';
import { MessageChannelInputEventDto } from '../dtos/message-channel-input-event.dto';

export type AvailableChannelType = { id: string; name: string };

@Injectable()
export class MessageChannelService {
  private readonly _availableChannelTypes: AvailableChannelType[] = [];

  constructor(
    @Inject(QUEUE_SERVICE) private readonly queueService: QueueService,
    private readonly userService: UserService,
    private readonly pairingService: ChannelPairingService,
    @Inject(MESSAGE_CHANNEL_REPOSITORY)
    private readonly messageChannelRepository: MessageChannelRepository,
    // TODO: Replace by bot service
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

    return channelDto;
  }

  async updateSessionStatus({
    sessionId,
    type,
    status,
  }: {
    sessionId: string;
    type: string;
    status: MessageChannelStatus;
  }): Promise<MessageChannelDto> {
    const channel = await this.messageChannelRepository.findBySessionIdAndType({
      sessionId,
      type,
    });
    if (!channel) {
      throw new MessageChannelNotFoundError();
    }

    const updatedChannel = await this.messageChannelRepository.update(
      channel.id,
      {
        status,
      },
    );

    this.queueService.publish({
      topic: MESSAGE_CHANNEL_STATUS_UPDATE({
        channelId: updatedChannel.id,
        channelType: updatedChannel.type,
      }),
      data: MessageChannelDto.parse(updatedChannel),
      dto: MessageChannelDto,
    });

    return MessageChannelDto.parse(updatedChannel);
  }

  async updateDetails(
    channelId: string,
    data: UpdateMessageChannelDetailsDto,
  ): Promise<MessageChannelDto> {
    const channel = await this.messageChannelRepository.findById(channelId);
    if (!channel) {
      throw new MessageChannelNotFoundError(channelId);
    }

    await this._validateChannelBindings({
      type: data.type,
      botId: channel.botId,
      userId: channel.userId,
    });

    if (
      data.type != channel.type &&
      channel.sessionId &&
      [
        MessageChannelStatus.CONNECTED,
        MessageChannelStatus.ONLINE,
        MessageChannelStatus.OFFLINE,
      ].includes(channel.status)
    ) {
      await this.pairingService.unpair(channel.id);
    }

    const updatedChannel = await this.messageChannelRepository.update(
      channel.id,
      {
        name: data.name,
        contact: data.contact,
        type: data.type,
      },
    );

    return MessageChannelDto.parse(updatedChannel);
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

  async outputEvent(data: MessageChannelOutputEventDto) {
    await this.queueService.publish({
      topic: MESSAGE_CHANNEL_OUTPUT_EVENT(data.channel.type),
      data,
      dto: MessageChannelOutputEventDto,
    });
  }

  async onOutputEvent({
    channelType,
    handler,
  }: {
    channelType: string;
    handler: QueueSubscriptionHandler<MessageChannelOutputEventDto>;
  }): Promise<QueueSubscription> {
    return this.queueService.subscribe({
      topic: MESSAGE_CHANNEL_OUTPUT_EVENT(channelType),
      dto: MessageChannelOutputEventDto,
      handler,
    });
  }

  async inputEvent(data: MessageChannelInputEventDto) {
    await this.queueService.publish({
      topic: MESSAGE_CHANNEL_INPUT_EVENT(data.channel.type),
      data,
      dto: MessageChannelInputEventDto,
    });
  }

  async onInputEvent({
    channelType,
    handler,
  }: {
    channelType: string;
    handler: QueueSubscriptionHandler<MessageChannelInputEventDto>;
  }): Promise<QueueSubscription> {
    return this.queueService.subscribe({
      topic: MESSAGE_CHANNEL_INPUT_EVENT(channelType),
      dto: MessageChannelInputEventDto,
      handler,
    });
  }

  // Helpers
  private async _validateChannelBindings(
    data: Partial<Pick<MessageChannelEntity, 'type' | 'botId' | 'userId'>>,
  ) {
    if (data.type) {
      const channelTypeIsAvailable = this._availableChannelTypes.some(
        (channel) => channel.id === data.type,
      );
      if (!channelTypeIsAvailable) {
        throw new MessageChannelTypeNotAvailableError(data.type);
      }
    }

    if (data.botId) {
      const bot = await this.botRepository.findById(data.botId);
      if (!bot) {
        throw new BotNotFoundError(data.botId);
      }
    }

    if (data.userId) {
      const user = await this.userService.findById(data.userId);
      if (!user) {
        throw new UserNotFoundError(data.userId);
      }
    }
  }
}
