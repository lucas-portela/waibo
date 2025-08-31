import { Inject, Injectable } from '@nestjs/common';
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

@Injectable()
export class ChatService {
  constructor(
    private readonly messageChannelService: MessageChannelService,
    @Inject(CHAT_REPOSITORY)
    private readonly chatRepository: ChatRepository,
    @Inject(CHAT_MESSAGE_REPOSITORY)
    private readonly chatMessageRepository: ChatMessageRepository,
  ) {}

  async create(data: CreateChatDto) {
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

  async update(chatId: string, data: UpdateChatDto) {
    const chat = await this.chatRepository.findById(chatId);
    if (!chat) {
      throw new ChatNotFoundError(chatId);
    }

    const updatedChat = await this.chatRepository.update(chatId, {
      name: data.name,
      contact: data.contact,
    });

    return ChatDto.parse(updatedChat);
  }

  async createMessage(data: CreateChatMessageDto) {
    const chat = await this.chatRepository.findById(data.chatId);
    if (!chat) {
      throw new ChatNotFoundError(data.chatId);
    }

    const channel = await this.messageChannelService.findById(
      chat.messageChannelId,
    );
    if (!channel) {
      throw new MessageChannelNotFoundError(chat.messageChannelId);
    }

    const createdMessage = await this.chatMessageRepository.create({
      chatId: data.chatId,
      content: data.content,
      sender: data.sender,
    });

    const chatMessageDto = ChatMessageDto.parse(createdMessage);

    const isOutputEvent = [ChatSender.BOT, ChatSender.USER].includes(
      data.sender,
    );

    if (isOutputEvent)
      await this.messageChannelService.outputEvent({
        channel,
        chat: ChatDto.parse(chat),
        message: chatMessageDto,
      });
  }
}
