import { Test, TestingModule } from '@nestjs/testing';
import { BotIntentPrismaRepository } from './bot-intent-prisma-repository';
import { PrismaService } from '../prisma.service';
import { BotIntentEntity } from 'src/domain/bot/entities/bot-intent.entity';

describe('BotIntentPrismaRepository', () => {
  let repository: BotIntentPrismaRepository;
  let prismaService: PrismaService;

  const mockBotIntent = {
    id: 'intent-1',
    botId: 'bot-1',
    tag: 'greeting',
    name: 'Greeting Intent',
    trigger: 'Hello, I need some help',
    response: 'Hello! How can I help you?',
    createdAt: new Date('2025-08-31T10:00:00Z'),
    updatedAt: new Date('2025-08-31T10:00:00Z'),
  };

  beforeEach(async () => {
    const mockPrismaService = {
      botIntent: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BotIntentPrismaRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<BotIntentPrismaRepository>(
      BotIntentPrismaRepository,
    );
    prismaService = module.get(PrismaService);
  });

  describe('findById', () => {
    it('should return a BotIntentEntity when intent exists', async () => {
      (prismaService.botIntent.findUnique as jest.Mock).mockResolvedValue(
        mockBotIntent,
      );

      const result = await repository.findById('intent-1');

      expect(result).toBeInstanceOf(BotIntentEntity);
      expect(result?.id).toBe('intent-1');
      expect(result?.botId).toBe('bot-1');
      expect(result?.tag).toBe('greeting');
      expect(result?.name).toBe('Greeting Intent');
      expect(result?.trigger).toBe('Hello, I need some help');
      expect(result?.response).toBe('Hello! How can I help you?');
      expect(prismaService.botIntent.findUnique).toHaveBeenCalledWith({
        where: { id: 'intent-1' },
      });
    });

    it('should return null when intent does not exist', async () => {
      (prismaService.botIntent.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
      expect(prismaService.botIntent.findUnique).toHaveBeenCalledWith({
        where: { id: 'non-existent' },
      });
    });
  });

  describe('findByBotId', () => {
    it('should return array of BotIntentEntity for bot', async () => {
      const mockIntents = [
        { ...mockBotIntent, id: 'intent-1', tag: 'greeting' },
        { ...mockBotIntent, id: 'intent-2', tag: 'farewell' },
      ];
      (prismaService.botIntent.findMany as jest.Mock).mockResolvedValue(
        mockIntents,
      );

      const result = await repository.findByBotId('bot-1');

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(BotIntentEntity);
      expect(result[1]).toBeInstanceOf(BotIntentEntity);
      expect(result[0].tag).toBe('greeting');
      expect(result[1].tag).toBe('farewell');
      expect(prismaService.botIntent.findMany).toHaveBeenCalledWith({
        where: { botId: 'bot-1' },
      });
    });

    it('should return empty array when bot has no intents', async () => {
      (prismaService.botIntent.findMany as jest.Mock).mockResolvedValue([]);

      const result = await repository.findByBotId('bot-with-no-intents');

      expect(result).toEqual([]);
      expect(prismaService.botIntent.findMany).toHaveBeenCalledWith({
        where: { botId: 'bot-with-no-intents' },
      });
    });
  });

  describe('findByTag', () => {
    it('should return BotIntentEntity when found by tag and botId', async () => {
      (prismaService.botIntent.findFirst as jest.Mock).mockResolvedValue(
        mockBotIntent,
      );

      const result = await repository.findByTag('greeting', 'bot-1');

      expect(result).toBeInstanceOf(BotIntentEntity);
      expect(result?.tag).toBe('greeting');
      expect(result?.botId).toBe('bot-1');
      expect(prismaService.botIntent.findFirst).toHaveBeenCalledWith({
        where: { tag: 'greeting', botId: 'bot-1' },
      });
    });

    it('should return null when intent not found by tag', async () => {
      (prismaService.botIntent.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await repository.findByTag('nonexistent', 'bot-1');

      expect(result).toBeNull();
      expect(prismaService.botIntent.findFirst).toHaveBeenCalledWith({
        where: { tag: 'nonexistent', botId: 'bot-1' },
      });
    });
  });

  describe('create', () => {
    it('should create and return a new BotIntentEntity', async () => {
      const createData = {
        botId: 'bot-1',
        tag: 'help',
        name: 'Help Intent',
        trigger: 'I need to schedule a meeting',
        response: 'I can help you with that, when would you like to meet?',
      };
      const createdIntent = {
        ...mockBotIntent,
        ...createData,
        id: 'new-intent-id',
      };
      (prismaService.botIntent.create as jest.Mock).mockResolvedValue(
        createdIntent,
      );

      const result = await repository.create(createData);

      expect(result).toBeInstanceOf(BotIntentEntity);
      expect(result.id).toBe('new-intent-id');
      expect(result.tag).toBe('help');
      expect(result.name).toBe('Help Intent');
      expect(result.trigger).toBe('I need to schedule a meeting');
      expect(result.response).toBe(
        'I can help you with that, when would you like to meet?',
      );
      expect(prismaService.botIntent.create).toHaveBeenCalledWith({
        data: {
          ...createData,
          createdAt: expect.any(Date),
        },
      });
    });
  });

  describe('update', () => {
    it('should update and return the updated BotIntentEntity', async () => {
      const updateData = { response: 'Updated response' };
      const updatedIntent = {
        ...mockBotIntent,
        response: 'Updated response',
        updatedAt: new Date(),
      };
      (prismaService.botIntent.update as jest.Mock).mockResolvedValue(
        updatedIntent,
      );

      const result = await repository.update('intent-1', updateData);

      expect(result).toBeInstanceOf(BotIntentEntity);
      expect(result.response).toBe('Updated response');
      expect(prismaService.botIntent.update).toHaveBeenCalledWith({
        where: { id: 'intent-1' },
        data: {
          ...updateData,
          updatedAt: expect.any(Date),
        },
      });
    });
  });

  describe('delete', () => {
    it('should delete the bot intent', async () => {
      (prismaService.botIntent.delete as jest.Mock).mockResolvedValue(
        mockBotIntent,
      );

      await repository.delete('intent-1');

      expect(prismaService.botIntent.delete).toHaveBeenCalledWith({
        where: { id: 'intent-1' },
      });
    });
  });
});
