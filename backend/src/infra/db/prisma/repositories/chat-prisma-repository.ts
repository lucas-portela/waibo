import {
  ChatCreate,
  ChatRepository,
  ChatUpdate,
} from 'src/domain/chat/repositories/chat.repository';
import { PrismaService } from '../prisma.service';
import { ChatEntity } from 'src/domain/chat/entities/chat.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatPrismaRepository implements ChatRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<ChatEntity | null> {
    const chat = await this.prisma.chat.findUnique({ where: { id } });
    return chat ? new ChatEntity(chat) : null;
  }

  async findByMessageChannelId(
    messageChannelId: string,
  ): Promise<ChatEntity[]> {
    const chats = await this.prisma.chat.findMany({
      where: { messageChannelId },
      orderBy: { createdAt: 'desc' },
    });
    return chats.map((chat) => new ChatEntity(chat));
  }

  async findByInternalIdentifier(
    internalIdentifier: string,
  ): Promise<ChatEntity | null> {
    const chat = await this.prisma.chat.findUnique({
      where: { internalIdentifier },
    });
    return chat ? new ChatEntity(chat) : null;
  }

  async findByContact(contact: string): Promise<ChatEntity[]> {
    const chats = await this.prisma.chat.findMany({
      where: { contact },
      orderBy: { createdAt: 'desc' },
    });
    return chats.map((chat) => new ChatEntity(chat));
  }

  async create(data: ChatCreate): Promise<ChatEntity> {
    const created = await this.prisma.chat.create({
      data: {
        ...data,
        createdAt: new Date(),
      },
    });
    return new ChatEntity(created);
  }

  async update(id: string, data: ChatUpdate): Promise<ChatEntity> {
    const updated = await this.prisma.chat.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
    return new ChatEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.chat.delete({ where: { id } });
  }
}
