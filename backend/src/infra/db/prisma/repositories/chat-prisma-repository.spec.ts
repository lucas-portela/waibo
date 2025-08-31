import { Test, TestingModule } from '@nestjs/testing';
import { ChatPrismaRepository } from './chat-prisma-repository';
import { PrismaService } from '../prisma.service';
import { ChatEntity } from 'src/domain/chat/entities/chat.entity';

describe('ChatPrismaRepository', () => {
  let repository: ChatPrismaRepository;
  let prismaService: PrismaService;

  const mockChat = {
    id: 'chat-1',
    messageChannelId: 'channel-1',
    name: 'John Doe',
    contact: '+1234567890',
    createdAt: new Date('2025-08-31T10:00:00Z'),
    updatedAt: new Date('2025-08-31T10:00:00Z'),
  };

  beforeEach(async () => {
    const mockPrismaService = {
      chat: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatPrismaRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<ChatPrismaRepository>(ChatPrismaRepository);
    prismaService = module.get(PrismaService);
  });

  describe('findById', () => {
    it('should return a ChatEntity when chat exists', async () => {
      (prismaService.chat.findUnique as jest.Mock).mockResolvedValue(mockChat);

      const result = await repository.findById('chat-1');

      expect(result).toBeInstanceOf(ChatEntity);
      expect(result?.id).toBe('chat-1');
      expect(result?.messageChannelId).toBe('channel-1');
      expect(result?.name).toBe('John Doe');
      expect(result?.contact).toBe('+1234567890');
      expect(prismaService.chat.findUnique).toHaveBeenCalledWith({
        where: { id: 'chat-1' },
      });
    });

    it('should return null when chat does not exist', async () => {
      (prismaService.chat.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
      expect(prismaService.chat.findUnique).toHaveBeenCalledWith({
        where: { id: 'non-existent' },
      });
    });
  });

  describe('findByMessageChannelId', () => {
    it('should return array of ChatEntity for message channel', async () => {
      const mockChats = [
        { ...mockChat, id: 'chat-1', name: 'John Doe' },
        { ...mockChat, id: 'chat-2', name: 'Jane Smith' },
      ];
      (prismaService.chat.findMany as jest.Mock).mockResolvedValue(mockChats);

      const result = await repository.findByMessageChannelId('channel-1');

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(ChatEntity);
      expect(result[1]).toBeInstanceOf(ChatEntity);
      expect(result[0].name).toBe('John Doe');
      expect(result[1].name).toBe('Jane Smith');
      expect(prismaService.chat.findMany).toHaveBeenCalledWith({
        where: { messageChannelId: 'channel-1' },
      });
    });

    it('should return empty array when no chats found', async () => {
      (prismaService.chat.findMany as jest.Mock).mockResolvedValue([]);

      const result = await repository.findByMessageChannelId('empty-channel');

      expect(result).toEqual([]);
      expect(prismaService.chat.findMany).toHaveBeenCalledWith({
        where: { messageChannelId: 'empty-channel' },
      });
    });
  });

  describe('findByContact', () => {
    it('should return array of ChatEntity for contact', async () => {
      const mockChats = [mockChat];
      (prismaService.chat.findMany as jest.Mock).mockResolvedValue(mockChats);

      const result = await repository.findByContact('+1234567890');

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(ChatEntity);
      expect(result[0].contact).toBe('+1234567890');
      expect(prismaService.chat.findMany).toHaveBeenCalledWith({
        where: { contact: '+1234567890' },
      });
    });

    it('should return empty array when no chats found for contact', async () => {
      (prismaService.chat.findMany as jest.Mock).mockResolvedValue([]);

      const result = await repository.findByContact('+9999999999');

      expect(result).toEqual([]);
      expect(prismaService.chat.findMany).toHaveBeenCalledWith({
        where: { contact: '+9999999999' },
      });
    });
  });

  describe('create', () => {
    it('should create and return a new ChatEntity', async () => {
      const createData = {
        messageChannelId: 'channel-1',
        name: 'New Contact',
        contact: '+9876543210',
      };
      const createdChat = {
        ...mockChat,
        ...createData,
        id: 'new-chat-id',
      };
      (prismaService.chat.create as jest.Mock).mockResolvedValue(createdChat);

      const result = await repository.create(createData);

      expect(result).toBeInstanceOf(ChatEntity);
      expect(result.id).toBe('new-chat-id');
      expect(result.messageChannelId).toBe('channel-1');
      expect(result.name).toBe('New Contact');
      expect(result.contact).toBe('+9876543210');
      expect(prismaService.chat.create).toHaveBeenCalledWith({
        data: {
          ...createData,
          createdAt: expect.any(Date),
        },
      });
    });
  });

  describe('update', () => {
    it('should update and return the updated ChatEntity', async () => {
      const updateData = { name: 'Updated Name' };
      const updatedChat = {
        ...mockChat,
        name: 'Updated Name',
        updatedAt: new Date(),
      };
      (prismaService.chat.update as jest.Mock).mockResolvedValue(updatedChat);

      const result = await repository.update('chat-1', updateData);

      expect(result).toBeInstanceOf(ChatEntity);
      expect(result.name).toBe('Updated Name');
      expect(prismaService.chat.update).toHaveBeenCalledWith({
        where: { id: 'chat-1' },
        data: {
          ...updateData,
          updatedAt: expect.any(Date),
        },
      });
    });
  });

  describe('delete', () => {
    it('should delete the chat', async () => {
      (prismaService.chat.delete as jest.Mock).mockResolvedValue(mockChat);

      await repository.delete('chat-1');

      expect(prismaService.chat.delete).toHaveBeenCalledWith({
        where: { id: 'chat-1' },
      });
    });
  });
});
