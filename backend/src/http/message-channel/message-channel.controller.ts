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
import { MessageChannelService } from 'src/application/chat/services/message-channel.service';
import { CreateMessageChannelRequestDto } from './dtos/create-message-channel-request.dto';
import { AdminOnly } from '../auth/auth.decorators';
import { AuthenticatedRequestDto } from '../auth/dtos/authenticated-request.dto';
import { PairingDataResponseDto } from './dtos/pairing-data-response.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessageChannelTypeDto as MessageChannelTypeResponseDto } from './dtos/message-channel-type-response.dto';
import { ChannelPairingService } from 'src/application/chat/services/channel-pairing.service';
import { UnauthorizedError } from 'src/core/error/unauthorized.error';
import { plainToInstance } from 'class-transformer';
import { MessageChannelResponseDto } from './dtos/message-channel-response.dto';

@ApiTags('Message Channels')
@Controller('channel')
export class MessageChannelController {
  constructor(
    private readonly messageChannelService: MessageChannelService,
    private readonly channelPairingService: ChannelPairingService,
  ) {}

  @Get('available')
  @ApiOperation({ summary: 'List available message channel types' })
  @ApiResponse({
    status: 200,
    type: MessageChannelTypeResponseDto,
    isArray: true,
  })
  getAvailableChannelTypes() {
    return this.messageChannelService
      .getAvailableChannelTypes()
      .map((channel) =>
        plainToInstance(MessageChannelTypeResponseDto, channel),
      );
  }

  @Post()
  @ApiOperation({ summary: 'Create a new message channel' })
  async create(
    @Body() createMessageChannelDto: CreateMessageChannelRequestDto,
    @Request() req: AuthenticatedRequestDto,
  ) {
    const userId = req.user.id;
    const channel = await this.messageChannelService.create({
      ...createMessageChannelDto,
      userId,
    });
    return plainToInstance(MessageChannelResponseDto, channel);
  }

  @Get('user/me')
  @ApiOperation({
    summary: 'Get all message channels for the authenticated user',
  })
  async findMyChannels(@Request() req: AuthenticatedRequestDto) {
    const userId = req.user.id;
    const channels = await this.messageChannelService.findByUserId(userId);
    return channels.map((channel) =>
      plainToInstance(MessageChannelResponseDto, channel),
    );
  }

  @Get('user/:userId')
  @AdminOnly()
  @ApiOperation({
    summary: 'Get all message channels for a specific user (admin only)',
  })
  async findByUserId(@Param('userId') userId: string) {
    const channels = await this.messageChannelService.findByUserId(userId);
    return channels.map((channel) =>
      plainToInstance(MessageChannelResponseDto, channel),
    );
  }

  @Put(':channelId')
  @ApiOperation({
    summary: 'Update minor details of a specific message channel',
  })
  async update(
    @Param('channelId') channelId: string,
    @Body() updateMessageChannelDto: Partial<CreateMessageChannelRequestDto>,
    @Request() req: AuthenticatedRequestDto,
  ) {
    await this._checkChannelACL(req, channelId);
    const channel = await this.messageChannelService.updateDetails(
      channelId,
      updateMessageChannelDto,
    );
    return plainToInstance(MessageChannelResponseDto, channel);
  }

  @Post(':channelId/request-pairing')
  @ApiOperation({ summary: 'Request pairing for a specific message channel' })
  async requestPairing(
    @Param('channelId') channelId: string,
    @Request() req: AuthenticatedRequestDto,
  ): Promise<PairingDataResponseDto> {
    await this._checkChannelACL(req, channelId);
    return this.channelPairingService.requestPairing(channelId);
  }

  @Post(':channelId/disconnect')
  @ApiOperation({ summary: 'Disconnect a specific message channel' })
  async disconnect(
    @Param('channelId') channelId: string,
    @Request() req: AuthenticatedRequestDto,
  ) {
    await this._checkChannelACL(req, channelId);
    return plainToInstance(
      MessageChannelResponseDto,
      await this.channelPairingService.unpair(channelId),
    );
  }

  @Delete(':channelId')
  @ApiOperation({ summary: 'Delete a specific message channel' })
  async delete(
    @Param('channelId') channelId: string,
    @Request() req: AuthenticatedRequestDto,
  ) {
    await this._checkChannelACL(req, channelId);
    await this.messageChannelService.delete(channelId);
  }

  // Helpers
  private async _checkChannelACL(
    req: AuthenticatedRequestDto,
    channelId: string,
  ) {
    if (req.isAdmin) return;
    const channel = await this.messageChannelService.findById(channelId);
    if (channel && channel.userId !== req.user.id) {
      throw new UnauthorizedError(
        'You do not have permission to access this channel',
      );
    }
  }
}
