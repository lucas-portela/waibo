import { Test, TestingModule } from '@nestjs/testing';
import { ChatMessagePrismaRepository } from './chat-message-prisma-repository';
import { PrismaService } from '../prisma.service';
import {
  ChatMessageEntity,
  ChatSender,
} from 'src/domain/chat/entities/chat-message.entity';

describe('ChatMessagePrismaRepository', () => {
  let repository: ChatMessagePrismaRepository;
  let prismaService: PrismaService;

  const mockChatMessage = {
    id: 'chat-message-1',
    chatId: 'chat-1',
    sender: 'USER',
    content: 'Hello world',
    createdAt: new Date('2025-08-31T10:00:00Z'),
    updatedAt: new Date('2025-08-31T10:00:00Z'),
  };

  beforeEach(async () => {
    const mockPrismaService = {
      chatMessage: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatMessagePrismaRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<ChatMessagePrismaRepository>(
      ChatMessagePrismaRepository,
    );
    prismaService = module.get(PrismaService);
  });

  describe('findById', () => {
    it('should return a ChatMessageEntity when message exists', async () => {
      (prismaService.chatMessage.findUnique as jest.Mock).mockResolvedValue(
        mockChatMessage,
      );

      const result = await repository.findById('chat-message-1');

      expect(result).toBeInstanceOf(ChatMessageEntity);
      expect(result?.id).toBe('chat-message-1');
      expect(result?.chatId).toBe('chat-1');
      expect(result?.sender).toBe(ChatSender.USER);
      expect(result?.content).toBe('Hello world');
      expect(prismaService.chatMessage.findUnique).toHaveBeenCalledWith({
        where: { id: 'chat-message-1' },
      });
    });

    it('should return null when message does not exist', async () => {
      (prismaService.chatMessage.findUnique as jest.Mock).mockResolvedValue(
        null,
      );

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
      expect(prismaService.chatMessage.findUnique).toHaveBeenCalledWith({
        where: { id: 'non-existent' },
      });
    });
  });

  describe('findByChatId', () => {
    it('should return array of ChatMessageEntity ordered by createdAt', async () => {
      const mockMessages = [
        {
          ...mockChatMessage,
          id: 'msg-1',
          createdAt: new Date('2025-08-31T10:00:00Z'),
        },
        {
          ...mockChatMessage,
          id: 'msg-2',
          createdAt: new Date('2025-08-31T10:01:00Z'),
        },
      ];
      (prismaService.chatMessage.findMany as jest.Mock).mockResolvedValue(
        mockMessages,
      );

      const result = await repository.findByChatId('chat-1');

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(ChatMessageEntity);
      expect(result[1]).toBeInstanceOf(ChatMessageEntity);
      expect(result[0].id).toBe('msg-1');
      expect(result[1].id).toBe('msg-2');
      expect(prismaService.chatMessage.findMany).toHaveBeenCalledWith({
        where: { chatId: 'chat-1' },
        orderBy: { createdAt: 'asc' },
      });
    });

    it('should return empty array when no messages found', async () => {
      (prismaService.chatMessage.findMany as jest.Mock).mockResolvedValue([]);

      const result = await repository.findByChatId('empty-chat');

      expect(result).toEqual([]);
      expect(prismaService.chatMessage.findMany).toHaveBeenCalledWith({
        where: { chatId: 'empty-chat' },
        orderBy: { createdAt: 'asc' },
      });
    });
  });

  describe('create', () => {
    it('should create and return a new ChatMessageEntity', async () => {
      const createData = {
        chatId: 'chat-1',
        sender: ChatSender.USER,
        content: 'New message',
      };
      const createdMessage = {
        ...mockChatMessage,
        ...createData,
        id: 'new-message-id',
      };
      (prismaService.chatMessage.create as jest.Mock).mockResolvedValue(
        createdMessage,
      );

      const result = await repository.create(createData);

      expect(result).toBeInstanceOf(ChatMessageEntity);
      expect(result.id).toBe('new-message-id');
      expect(result.chatId).toBe('chat-1');
      expect(result.sender).toBe(ChatSender.USER);
      expect(result.content).toBe('New message');
      expect(prismaService.chatMessage.create).toHaveBeenCalledWith({
        data: {
          ...createData,
          createdAt: expect.any(Date),
        },
      });
    });
  });

  describe('update', () => {
    it('should update and return the updated ChatMessageEntity', async () => {
      const updateData = { content: 'Updated message' };
      const updatedMessage = {
        ...mockChatMessage,
        content: 'Updated message',
        updatedAt: new Date(),
      };
      (prismaService.chatMessage.update as jest.Mock).mockResolvedValue(
        updatedMessage,
      );

      const result = await repository.update('chat-message-1', updateData);

      expect(result).toBeInstanceOf(ChatMessageEntity);
      expect(result.content).toBe('Updated message');
      expect(prismaService.chatMessage.update).toHaveBeenCalledWith({
        where: { id: 'chat-message-1' },
        data: {
          ...updateData,
          updatedAt: expect.any(Date),
        },
      });
    });
  });

  describe('delete', () => {
    it('should delete the chat message', async () => {
      (prismaService.chatMessage.delete as jest.Mock).mockResolvedValue(
        mockChatMessage,
      );

      await repository.delete('chat-message-1');

      expect(prismaService.chatMessage.delete).toHaveBeenCalledWith({
        where: { id: 'chat-message-1' },
      });
    });
  });
});
