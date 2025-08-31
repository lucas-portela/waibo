import { Test, TestingModule } from '@nestjs/testing';
import { BotPrismaRepository } from './bot-prisma-repository';
import { PrismaService } from '../prisma.service';
import { BotEntity } from 'src/domain/bot/entities/bot.entity';

describe('BotPrismaRepository', () => {
  let repository: BotPrismaRepository;
  let prismaService: PrismaService;

  const mockBot = {
    id: 'bot-1',
    name: 'Test Bot',
    prompt: 'You are a helpful assistant',
    userId: 'user-1',
    createdAt: new Date('2025-08-31T10:00:00Z'),
    updatedAt: new Date('2025-08-31T10:00:00Z'),
  };

  beforeEach(async () => {
    const mockPrismaService = {
      bot: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BotPrismaRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<BotPrismaRepository>(BotPrismaRepository);
    prismaService = module.get(PrismaService);
  });

  describe('findById', () => {
    it('should return a BotEntity when bot exists', async () => {
      (prismaService.bot.findUnique as jest.Mock).mockResolvedValue(mockBot);

      const result = await repository.findById('bot-1');

      expect(result).toBeInstanceOf(BotEntity);
      expect(result?.id).toBe('bot-1');
      expect(result?.name).toBe('Test Bot');
      expect(result?.prompt).toBe('You are a helpful assistant');
      expect(result?.userId).toBe('user-1');
      expect(prismaService.bot.findUnique).toHaveBeenCalledWith({
        where: { id: 'bot-1' },
      });
    });

    it('should return null when bot does not exist', async () => {
      (prismaService.bot.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await repository.findById('non-existent');

      expect(result).toBeNull();
      expect(prismaService.bot.findUnique).toHaveBeenCalledWith({
        where: { id: 'non-existent' },
      });
    });
  });

  describe('findByUserId', () => {
    it('should return array of BotEntity for user', async () => {
      const mockBots = [
        { ...mockBot, id: 'bot-1', name: 'Bot 1' },
        { ...mockBot, id: 'bot-2', name: 'Bot 2' },
      ];
      (prismaService.bot.findMany as jest.Mock).mockResolvedValue(mockBots);

      const result = await repository.findByUserId('user-1');

      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(BotEntity);
      expect(result[1]).toBeInstanceOf(BotEntity);
      expect(result[0].name).toBe('Bot 1');
      expect(result[1].name).toBe('Bot 2');
      expect(prismaService.bot.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
      });
    });

    it('should return empty array when user has no bots', async () => {
      (prismaService.bot.findMany as jest.Mock).mockResolvedValue([]);

      const result = await repository.findByUserId('user-with-no-bots');

      expect(result).toEqual([]);
      expect(prismaService.bot.findMany).toHaveBeenCalledWith({
        where: { userId: 'user-with-no-bots' },
      });
    });
  });

  describe('create', () => {
    it('should create and return a new BotEntity', async () => {
      const createData = {
        name: 'New Bot',
        prompt: 'You are a new assistant',
        userId: 'user-1',
      };
      const createdBot = {
        ...mockBot,
        ...createData,
        id: 'new-bot-id',
      };
      (prismaService.bot.create as jest.Mock).mockResolvedValue(createdBot);

      const result = await repository.create(createData);

      expect(result).toBeInstanceOf(BotEntity);
      expect(result.id).toBe('new-bot-id');
      expect(result.name).toBe('New Bot');
      expect(result.prompt).toBe('You are a new assistant');
      expect(result.userId).toBe('user-1');
      expect(prismaService.bot.create).toHaveBeenCalledWith({
        data: {
          ...createData,
          createdAt: expect.any(Date),
        },
      });
    });
  });

  describe('update', () => {
    it('should update and return the updated BotEntity', async () => {
      const updateData = { name: 'Updated Bot Name' };
      const updatedBot = {
        ...mockBot,
        name: 'Updated Bot Name',
        updatedAt: new Date(),
      };
      (prismaService.bot.update as jest.Mock).mockResolvedValue(updatedBot);

      const result = await repository.update('bot-1', updateData);

      expect(result).toBeInstanceOf(BotEntity);
      expect(result.name).toBe('Updated Bot Name');
      expect(prismaService.bot.update).toHaveBeenCalledWith({
        where: { id: 'bot-1' },
        data: {
          ...updateData,
          updatedAt: expect.any(Date),
        },
      });
    });
  });

  describe('delete', () => {
    it('should delete the bot', async () => {
      (prismaService.bot.delete as jest.Mock).mockResolvedValue(mockBot);

      await repository.delete('bot-1');

      expect(prismaService.bot.delete).toHaveBeenCalledWith({
        where: { id: 'bot-1' },
      });
    });
  });
});
