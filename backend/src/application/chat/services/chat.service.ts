import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CHAT_MESSAGE_REPOSITORY, CHAT_REPOSITORY } from '../tokens';
import type { ChatRepository } from 'src/domain/chat/repositories/chat.repository';
import type { ChatMessageRepository } from 'src/domain/chat/repositories/chat-message.repository';
import { MessageChannelService } from './message-channel.service';
import { CreateChatDto } from '../dtos/create-chat.dto';
import { UpdateChatDto } from '../dtos/update-chat.dto';
import { MessageChannelNotFoundError } from 'src/core/error/message-channel-not-found.error';
import { ChatDto } from '../dtos/chat.dto';
import { ChatNotFoundError } from 'src/core/error/chat-not-found.error';
import { CreateChatMessageDto } from '../dtos/create-chat-message.dto';
import { ChatMessageDto } from '../dtos/chat-message.dto';
import { ChatSender } from 'src/domain/chat/entities/chat-message.entity';
import {
  QueueSubscriptionHandler,
  QueueSubscription,
} from 'src/application/queue/ports/queue.service';
import { MessageChannelInputEventDto } from '../dtos/message-channel-input-event.dto';
import { MessageChannelOutputEventDto } from '../dtos/message-channel-output-event.dto';
import {
  MESSAGE_CHANNEL_OUTPUT_EVENT,
  MESSAGE_CHANNEL_INPUT_EVENT,
} from '../topics';
import { QUEUE_SERVICE } from 'src/application/queue/tokens';
import type { QueueService } from 'src/application/queue/ports/queue.service';

@Injectable()
export class ChatService {
  constructor(
    @Inject(forwardRef(() => MessageChannelService))
    private readonly messageChannelService: MessageChannelService,
    @Inject(CHAT_REPOSITORY)
    private readonly chatRepository: ChatRepository,
    @Inject(CHAT_MESSAGE_REPOSITORY)
    private readonly chatMessageRepository: ChatMessageRepository,
    @Inject(QUEUE_SERVICE) private readonly queueService: QueueService,
  ) {}

  async createChat(data: CreateChatDto) {
    const channel = await this.messageChannelService.findById(
      data.messageChannelId,
    );
    if (!channel) {
      throw new MessageChannelNotFoundError(data.messageChannelId);
    }

    const chat = await this.chatRepository.create({
      messageChannelId: data.messageChannelId,
      contact: data.contact,
      name: data.name,
      internalIdentifier: data.internalIdentifier,
    });

    return ChatDto.parse(chat);
  }

  async findChatByInternalIdentifier(internalIdentifier: string) {
    const chat =
      await this.chatRepository.findByInternalIdentifier(internalIdentifier);
    return chat ? ChatDto.parse(chat) : null;
  }

  async findChatById(chatId: string): Promise<ChatDto | null> {
    const chat = await this.chatRepository.findById(chatId);
    return chat ? ChatDto.parse(chat) : null;
  }

  async updateChat(chatId: string, data: UpdateChatDto) {
    const chat = await this.chatRepository.findById(chatId);
    if (!chat) {
      throw new ChatNotFoundError(chatId);
    }

    const updatedChat = await this.chatRepository.update(chatId, {
      name: data.name,
      contact: data.contact,
      botMemory: data.botMemory,
    });

    return ChatDto.parse(updatedChat);
  }

  async deleteChat(chatId: string) {
    const chat = await this.chatRepository.findById(chatId);
    if (!chat) {
      throw new ChatNotFoundError(chatId);
    }

    await this.chatRepository.delete(chatId);
  }

  async findChatsByMessageChannelId(messageChannelId: string) {
    const chats =
      await this.chatRepository.findByMessageChannelId(messageChannelId);
    return chats.map((chat) => ChatDto.parse(chat));
  }

  async findMessagesByChatId(chatId: string) {
    const messages = await this.chatMessageRepository.findByChatId(chatId);
    return messages.map((message) => ChatMessageDto.parse(message));
  }

  async createMessage(data: CreateChatMessageDto) {
    const chat = await this.findChatByInternalIdentifier(
      data.chatInternalIdentifier,
    );
    if (!chat) {
      throw new ChatNotFoundError();
    }

    const channel = await this.messageChannelService.findById(
      chat.messageChannelId,
    );
    if (!channel) {
      throw new MessageChannelNotFoundError(chat.messageChannelId);
    }

    const createdMessage = await this.chatMessageRepository.create({
      chatId: chat.id,
      content: data.content,
      sender: data.sender,
    });

    const chatMessageDto = ChatMessageDto.parse(createdMessage);

    const isOutputEvent = [ChatSender.BOT, ChatSender.USER].includes(
      data.sender,
    );

    if (isOutputEvent) {
      await this._outputEvent({
        channel,
        chat: ChatDto.parse(chat),
        message: chatMessageDto,
      });
    } else {
      await this._inputEvent({
        channel,
        chat: ChatDto.parse(chat),
        message: chatMessageDto,
      });
    }
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
  async _inputEvent(data: MessageChannelInputEventDto) {
    await this.queueService.publish({
      topic: MESSAGE_CHANNEL_INPUT_EVENT(data.channel.type),
      data,
      dto: MessageChannelInputEventDto,
    });
  }

  private async _outputEvent(data: MessageChannelOutputEventDto) {
    await this.queueService.publish({
      topic: MESSAGE_CHANNEL_OUTPUT_EVENT(data.channel.type),
      data,
      dto: MessageChannelOutputEventDto,
    });
  }
}
