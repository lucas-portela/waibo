import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { BotService } from 'src/application/bot/services/bot.service';
import { CreateBotRequestDto } from './dtos/create-bot-request.dto';
import { UpdateBotRequestDto } from './dtos/update-bot-request.dto';
import { BotResponseDto } from './dtos/bot-response.dto';
import { AdminOnly } from '../auth/auth.decorators';
import { AuthenticatedRequestDto } from '../auth/dtos/authenticated-request.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { UnauthorizedError } from 'src/core/error/unauthorized.error';

@ApiTags('Bots')
@Controller('bot')
export class BotController {
  constructor(private readonly botService: BotService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new bot' })
  @ApiResponse({
    status: 201,
    description: 'Bot created successfully',
    type: BotResponseDto,
  })
  async create(
    @Body() createBotDto: CreateBotRequestDto,
    @Request() req: AuthenticatedRequestDto,
  ) {
    const userId = req.user.id;
    const bot = await this.botService.create({
      ...createBotDto,
      userId,
    });
    return plainToInstance(BotResponseDto, bot);
  }

  @Get('user/me')
  @ApiOperation({
    summary: 'Get all bots for the authenticated user',
  })
  @ApiResponse({
    status: 200,
    description: 'User bots retrieved successfully',
    type: BotResponseDto,
    isArray: true,
  })
  async findMyBots(@Request() req: AuthenticatedRequestDto) {
    const userId = req.user.id;
    const bots = await this.botService.findByUserId(userId);
    return bots.map((bot) => plainToInstance(BotResponseDto, bot));
  }

  @Get('user/:userId')
  @AdminOnly()
  @ApiOperation({
    summary: 'Get all bots for a specific user (admin only)',
  })
  @ApiResponse({
    status: 200,
    description: 'User bots retrieved successfully',
    type: BotResponseDto,
    isArray: true,
  })
  async findByUserId(@Param('userId') userId: string) {
    const bots = await this.botService.findByUserId(userId);
    return bots.map((bot) => plainToInstance(BotResponseDto, bot));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific bot by ID' })
  @ApiResponse({
    status: 200,
    description: 'Bot retrieved successfully',
    type: BotResponseDto,
  })
  async findById(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequestDto,
  ) {
    const bot = await this.botService.findById(id);

    // Check if user is admin or owner of the bot
    if (!req.isAdmin && bot.userId !== req.user.id) {
      throw new UnauthorizedError(
        'You do not have permission to access this bot',
      );
    }

    return plainToInstance(BotResponseDto, bot);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a specific bot' })
  @ApiResponse({
    status: 200,
    description: 'Bot updated successfully',
    type: BotResponseDto,
  })
  async update(
    @Param('id') id: string,
    @Body() updateBotDto: UpdateBotRequestDto,
    @Request() req: AuthenticatedRequestDto,
  ) {
    const bot = await this.botService.findById(id);

    // Check if user is admin or owner of the bot
    if (!req.isAdmin && bot.userId !== req.user.id) {
      throw new UnauthorizedError(
        'You do not have permission to update this bot',
      );
    }

    const updatedBot = await this.botService.update(id, updateBotDto);
    return plainToInstance(BotResponseDto, updatedBot);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a specific bot' })
  @ApiResponse({
    status: 204,
    description: 'Bot deleted successfully',
  })
  async delete(
    @Param('id') id: string,
    @Request() req: AuthenticatedRequestDto,
  ) {
    const bot = await this.botService.findById(id);

    // Check if user is admin or owner of the bot
    if (!req.isAdmin && bot.userId !== req.user.id) {
      throw new UnauthorizedError(
        'You do not have permission to delete this bot',
      );
    }

    await this.botService.delete(id);
  }
}
