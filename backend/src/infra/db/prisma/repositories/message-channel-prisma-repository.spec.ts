import { Test, TestingModule } from '@nestjs/testing';
import { MessageChannelPrismaRepository } from './message-channel-prisma-repository';
import { PrismaService } from '../prisma.service';
import {
  MessageChannelEntity,
  MessageChannelStatus,
} from 'src/domain/chat/entities/message-channel.entity';

describe('MessageChannelPrismaRepository', () => {
  let repository: MessageChannelPrismaRepository;
  let prismaService: PrismaService;

  const mockMessageChannel = {
    id: 'channel-1',
    name: 'Test Channel',
    contact: '+1234567890',
    type: 'whatsapp',
    status: 'CONNECTED',
    userId: 'user-1',
    botId: 'bot-1',
    sessionId: 'session-123',
    createdAt: new Date('2025-08-31T10:00:00Z'),
    updatedAt: new Date('2025-08-31T10:00:00Z'),
  };

  beforeEach(async () => {
    const mockPrismaService = {
      messageChannel: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageChannelPrismaRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<MessageChannelPrismaRepository>(
      MessageChannelPrismaRepository,
    );
    prismaService = module.get(PrismaService);
  });

  describe('findById', () => {
    it('should return a MessageChannelEntity when channel exists', async () => {
      (prismaService.messageChannel.findUnique as jest.Mock).mockResolvedValue(
        mockMessageChannel,
      );

      const result = await repository.findById('channel-1');

      expect(result).toBeInstanceOf(MessageChannelEntity);
      expect(result?.id).toBe('channel-1');
      expect(result?.name).toBe('Test Channel');
      expect(result?.contact).toBe('+1234567890');
      expect(result?.type).toBe('whatsapp');
      expect(result?.status).toBe(MessageChannelStatus.CONNECTED);
      expect(result?.userId).toBe('user-1');
      expect(result?.botId).toBe('bot-1');
      expect(result?.sessionId).toBe('session-123');
      expect(prismaService.messageChannel.findUnique).toHaveBeenCalledWith({
        where: { id: 'channel-1' },
      });
    });

    it('should return null when channel does not exist', async () => {
      (prismaService.messageChannel.findUnique as jest.Mock).mockResolvedValue(
        null,
      );

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
      expect(prismaService.messageChannel.findUnique).toHaveBeenCalledWith({
        where: { id: 'non-existent' },
      });
    });
  });

  describe('findByUserId', () => {
    it('should return array of MessageChannelEntity for user', async () => {
      const mockChannels = [
        { ...mockMessageChannel, id: 'channel-1', name: 'Channel 1' },
        { ...mockMessageChannel, id: 'channel-2', name: 'Channel 2' },
      ];
      (prismaService.messageChannel.findMany as jest.Mock).mockResolvedValue(
        mockChannels,
      );

      const result = await repository.findByUserId('user-1');

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(MessageChannelEntity);
      expect(result[1]).toBeInstanceOf(MessageChannelEntity);
      expect(result[0].name).toBe('Channel 1');
      expect(result[1].name).toBe('Channel 2');
      expect(prismaService.messageChannel.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
      });
    });
  });

  describe('findByBotId', () => {
    it('should return array of MessageChannelEntity for bot', async () => {
      const mockChannels = [mockMessageChannel];
      (prismaService.messageChannel.findMany as jest.Mock).mockResolvedValue(
        mockChannels,
      );

      const result = await repository.findByBotId('bot-1');

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(MessageChannelEntity);
      expect(result[0].botId).toBe('bot-1');
      expect(prismaService.messageChannel.findMany).toHaveBeenCalledWith({
        where: { botId: 'bot-1' },
      });
    });
  });

  describe('findByName', () => {
    it('should return MessageChannelEntity when found by name', async () => {
      (prismaService.messageChannel.findUnique as jest.Mock).mockResolvedValue(
        mockMessageChannel,
      );

      const result = await repository.findByName('Test Channel');

      expect(result).toBeInstanceOf(MessageChannelEntity);
      expect(result?.name).toBe('Test Channel');
      expect(prismaService.messageChannel.findUnique).toHaveBeenCalledWith({
        where: { name: 'Test Channel' },
      });
    });

    it('should return null when channel not found by name', async () => {
      (prismaService.messageChannel.findUnique as jest.Mock).mockResolvedValue(
        null,
      );

      const result = await repository.findByName('Nonexistent Channel');

      expect(result).toBeNull();
      expect(prismaService.messageChannel.findUnique).toHaveBeenCalledWith({
        where: { name: 'Nonexistent Channel' },
      });
    });
  });

  describe('create', () => {
    it('should create and return a new MessageChannelEntity', async () => {
      const createData = {
        name: 'New Channel',
        contact: '+9876543210',
        type: 'whatsapp',
        status: MessageChannelStatus.DISCONNECTED,
        userId: 'user-1',
        botId: 'bot-1',
        sessionId: null,
      };
      const createdChannel = {
        ...mockMessageChannel,
        ...createData,
        id: 'new-channel-id',
      };
      (prismaService.messageChannel.create as jest.Mock).mockResolvedValue(
        createdChannel,
      );

      const result = await repository.create(createData);

      expect(result).toBeInstanceOf(MessageChannelEntity);
      expect(result.id).toBe('new-channel-id');
      expect(result.name).toBe('New Channel');
      expect(result.contact).toBe('+9876543210');
      expect(result.status).toBe(MessageChannelStatus.DISCONNECTED);
      expect(prismaService.messageChannel.create).toHaveBeenCalledWith({
        data: {
          ...createData,
          createdAt: expect.any(Date),
        },
      });
    });
  });

  describe('update', () => {
    it('should update and return the updated MessageChannelEntity', async () => {
      const updateData = { status: MessageChannelStatus.ONLINE };
      const updatedChannel = {
        ...mockMessageChannel,
        status: 'ONLINE',
        updatedAt: new Date(),
      };
      (prismaService.messageChannel.update as jest.Mock).mockResolvedValue(
        updatedChannel,
      );

      const result = await repository.update('channel-1', updateData);

      expect(result).toBeInstanceOf(MessageChannelEntity);
      expect(result.status).toBe(MessageChannelStatus.ONLINE);
      expect(prismaService.messageChannel.update).toHaveBeenCalledWith({
        where: { id: 'channel-1' },
        data: {
          ...updateData,
          updatedAt: expect.any(Date),
        },
      });
    });
  });

  describe('delete', () => {
    it('should delete the message channel', async () => {
      (prismaService.messageChannel.delete as jest.Mock).mockResolvedValue(
        mockMessageChannel,
      );

      await repository.delete('channel-1');

      expect(prismaService.messageChannel.delete).toHaveBeenCalledWith({
        where: { id: 'channel-1' },
      });
    });
  });
});
