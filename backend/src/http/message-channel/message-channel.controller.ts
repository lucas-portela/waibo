import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
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
    return this.messageChannelService.getAvailableChannelTypes();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new message channel' })
  async create(
    @Body() createMessageChannelDto: CreateMessageChannelRequestDto,
    @Request() req: AuthenticatedRequestDto,
  ) {
    const userId = req.user.id;
    return this.messageChannelService.create({
      ...createMessageChannelDto,
      userId,
    });
  }

  @Get('user/me')
  @ApiOperation({
    summary: 'Get all message channels for the authenticated user',
  })
  async findMyChannels(@Request() req: AuthenticatedRequestDto) {
    const userId = req.user.id;
    return this.messageChannelService.findByUserId(userId);
  }

  @Get('user/:userId')
  @AdminOnly()
  @ApiOperation({
    summary: 'Get all message channels for a specific user (admin only)',
  })
  async findByUserId(@Param('userId') userId: string) {
    return this.messageChannelService.findByUserId(userId);
  }

  @Post(':channelId/request-pairing')
  @ApiOperation({ summary: 'Request pairing for a specific message channel' })
  async requestPairing(
    @Param('channelId') channelId: string,
  ): Promise<PairingDataResponseDto> {
    return this.channelPairingService.requestPairing(channelId);
  }

  @Delete(':channelId')
  @ApiOperation({ summary: 'Delete a specific message channel' })
  async delete(
    @Param('channelId') channelId: string,
    @Request() req: AuthenticatedRequestDto,
  ) {
    if (!req.isAdmin) {
      const channel = await this.messageChannelService.findById(channelId);
      if (channel && channel.userId !== req.user.id) {
        throw new ForbiddenException(
          'You do not have permission to delete this channel',
        );
      }
    }

    await this.messageChannelService.delete(channelId);
  }
}
