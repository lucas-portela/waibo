import {
  MessageChannelCreate,
  MessageChannelRepository,
  MessageChannelUpdate,
} from 'src/domain/chat/repositories/message-channel.repository';
import { PrismaService } from '../prisma.service';
import { MessageChannelEntity } from 'src/domain/chat/entities/message-channel.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MessageChannelPrismaRepository
  implements MessageChannelRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<MessageChannelEntity | null> {
    const messageChannel = await this.prisma.messageChannel.findUnique({
      where: { id },
    });
    return messageChannel ? new MessageChannelEntity(messageChannel) : null;
  }

  async findBySessionId(
    sessionId: string,
  ): Promise<MessageChannelEntity | null> {
    const messageChannel = await this.prisma.messageChannel.findUnique({
      where: { sessionId: sessionId },
    });
    return messageChannel ? new MessageChannelEntity(messageChannel) : null;
  }

  async findByUserId(userId: string): Promise<MessageChannelEntity[]> {
    const messageChannels = await this.prisma.messageChannel.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return messageChannels.map(
      (messageChannel) => new MessageChannelEntity(messageChannel),
    );
  }

  async findByBotId(botId: string): Promise<MessageChannelEntity[]> {
    const messageChannels = await this.prisma.messageChannel.findMany({
      where: { botId },
      orderBy: { createdAt: 'desc' },
    });
    return messageChannels.map(
      (messageChannel) => new MessageChannelEntity(messageChannel),
    );
  }

  async findByType(type: string): Promise<MessageChannelEntity[]> {
    const messageChannels = await this.prisma.messageChannel.findMany({
      where: { type },
      orderBy: { createdAt: 'desc' },
    });
    return messageChannels.map(
      (messageChannel) => new MessageChannelEntity(messageChannel),
    );
  }

  async findByName(name: string): Promise<MessageChannelEntity | null> {
    const messageChannel = await this.prisma.messageChannel.findUnique({
      where: { name },
    });
    return messageChannel ? new MessageChannelEntity(messageChannel) : null;
  }

  async create(data: MessageChannelCreate): Promise<MessageChannelEntity> {
    const created = await this.prisma.messageChannel.create({
      data: {
        ...data,
        createdAt: new Date(),
      },
    });
    return new MessageChannelEntity(created);
  }

  async update(
    id: string,
    data: MessageChannelUpdate,
  ): Promise<MessageChannelEntity> {
    const updated = await this.prisma.messageChannel.update({
      where: { id },
      data: { ...data, updatedAt: new Date() },
    });
    return new MessageChannelEntity(updated);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.messageChannel.delete({ where: { id } });
  }
}
