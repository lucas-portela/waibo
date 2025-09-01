import { Inject, Injectable } from '@nestjs/common';
import type { MessageChannelRepository } from 'src/domain/chat/repositories/message-channel.repository';
import type { BotRepository } from 'src/domain/bot/repositories/bot.repository';
import type { QueueService } from 'src/application/queue/ports/queue.service';
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
  MESSAGE_CHANNEL_OUTPUT_EVENT,
  MESSAGE_CHANNEL_STATUS_UPDATE,
} from '../topics';
import { UpdateMessageChannelDetailsDto } from '../dtos/update-message-channel-details.dto';
import { UserService } from 'src/application/user/services/user.service';
import { ChannelPairingService } from './channel-pairing.service';
import { MessageChannelOutputEventDto } from '../dtos/message-channel-output-event.dto';
import { ChatService } from './chat.service';

export type ChannelType = { type: string; name: string };

@Injectable()
export class MessageChannelService {
  private readonly _availableChannelTypes: ChannelType[] = [];

  constructor(
    @Inject(QUEUE_SERVICE) private readonly queueService: QueueService,
    private readonly userService: UserService,
    private readonly pairingService: ChannelPairingService,
    private readonly chatService: ChatService,
    @Inject(MESSAGE_CHANNEL_REPOSITORY)
    private readonly messageChannelRepository: MessageChannelRepository,
    // TODO: Replace by bot service
    @Inject(BOT_REPOSITORY) private readonly botRepository: BotRepository,
  ) {}

  getAvailableChannelTypes(): ChannelType[] {
    return _.cloneDeep(this._availableChannelTypes);
  }

  registerChannelType({ type, name }: ChannelType) {
    if (!this._availableChannelTypes.find((channel) => channel.type === type)) {
      this._availableChannelTypes.push({ type, name });
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
    status,
  }: {
    sessionId: string;
    status: MessageChannelStatus;
  }): Promise<MessageChannelDto> {
    const channel =
      await this.messageChannelRepository.findBySessionId(sessionId);
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

    if (data.type != channel.type && channel.sessionId) {
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

  async findByType(type: string): Promise<MessageChannelDto[]> {
    const channels = await this.messageChannelRepository.findByType(type);
    return channels.map((channel) => MessageChannelDto.parse(channel));
  }

  async findByUserId(userId: string): Promise<MessageChannelDto[]> {
    const channels = await this.messageChannelRepository.findByUserId(userId);
    return channels.map((channel) => MessageChannelDto.parse(channel));
  }

  async delete(channelId: string): Promise<void> {
    const channel = await this.messageChannelRepository.findById(channelId);
    if (!channel) {
      throw new MessageChannelNotFoundError(channelId);
    }

    if (channel.sessionId) await this.pairingService.unpair(channelId);
    const chats = await this.chatService.findChatsByMessageChannelId(channelId);
    for (const chat of chats) {
      await this.chatService.deleteChat(chat.id);
    }
    await this.messageChannelRepository.delete(channelId);
  }

  async outputEvent(data: MessageChannelOutputEventDto) {
    await this.queueService.publish({
      topic: MESSAGE_CHANNEL_OUTPUT_EVENT(data.channel.type),
      data,
      dto: MessageChannelOutputEventDto,
    });
  }

  // Helpers
  private async _validateChannelBindings(
    data: Partial<Pick<MessageChannelEntity, 'type' | 'botId' | 'userId'>>,
  ) {
    if (data.type) {
      const channelTypeIsAvailable = this._availableChannelTypes.some(
        (channel) => channel.type === data.type,
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
