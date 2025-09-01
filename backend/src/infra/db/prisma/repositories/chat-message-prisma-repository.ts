import {
  ChatMessageCreate,
  ChatMessageRepository,
  ChatMessageUpdate,
} from 'src/domain/chat/repositories/chat-message.repository';
import { PrismaService } from '../prisma.service';
import { ChatMessageEntity } from 'src/domain/chat/entities/chat-message.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatMessagePrismaRepository implements ChatMessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<ChatMessageEntity | null> {
    const chatMessage = await this.prisma.chatMessage.findUnique({
      where: { id },
    });
    return chatMessage ? new ChatMessageEntity(chatMessage) : null;
  }

  async findByChatId(chatId: string): Promise<ChatMessageEntity[]> {
    const chatMessages = await this.prisma.chatMessage.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
    });
    return chatMessages.map(
      (chatMessage) => new ChatMessageEntity(chatMessage),
    );
  }

  async create(data: ChatMessageCreate): Promise<ChatMessageEntity> {
    const created = await this.prisma.chatMessage.create({
      data: {
        ...data,
        createdAt: new Date(),
      },
    });
    return new ChatMessageEntity(created);
  }

  async update(
    id: string,
    data: ChatMessageUpdate,
  ): Promise<ChatMessageEntity> {
    const updated = await this.prisma.chatMessage.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
    return new ChatMessageEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.chatMessage.delete({ where: { id } });
  }

  async deleteByChatId(chatId: string): Promise<void> {
    await this.prisma.chatMessage.deleteMany({ where: { chatId } });
  }
}
