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
import { ChatService } from 'src/application/chat/services/chat.service';
import { MessageChannelService } from 'src/application/chat/services/message-channel.service';
import { UpdateChatRequestDto } from './dtos/update-chat-request.dto';
import { SendMessageRequestDto } from './dtos/send-message-request.dto';
import { ChatResponseDto } from './dtos/chat-response.dto';
import { ChatMessageResponseDto } from './dtos/chat-message-response.dto';
import { AuthenticatedRequestDto } from '../auth/dtos/authenticated-request.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { ChatSender } from 'src/domain/chat/entities/chat-message.entity';
import { MessageChannelNotFoundError } from 'src/core/error/message-channel-not-found.error';
import { ChatNotFoundError } from 'src/core/error/chat-not-found.error';
import { UnauthorizedError } from 'src/core/error/unauthorized.error';

@ApiTags('Chats')
@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly messageChannelService: MessageChannelService,
  ) {}

  @Get('channel/:channelId')
  @ApiOperation({ summary: 'List chats by channel ID' })
  @ApiResponse({
    status: 200,
    description: 'List of chats retrieved successfully',
    type: ChatResponseDto,
    isArray: true,
  })
  async listChatsByChannelId(
    @Param('channelId') channelId: string,
    @Request() req: AuthenticatedRequestDto,
  ) {
    await this._checkChannelACL({ channelId, req });

    const chats = await this.chatService.findChatsByMessageChannelId(channelId);
    return chats.map((chat) => plainToInstance(ChatResponseDto, chat));
  }

  @Get(':chatId/messages')
  @ApiOperation({ summary: 'List all messages in a chat' })
  @ApiResponse({
    status: 200,
    description: 'List of messages retrieved successfully',
    type: ChatMessageResponseDto,
    isArray: true,
  })
  async listMessagesByChatId(
    @Param('chatId') chatId: string,
    @Request() req: AuthenticatedRequestDto,
  ) {
    await this._checkChatACL({ chatId, req });
    const messages = await this.chatService.findMessagesByChatId(chatId);
    return messages.map((message) =>
      plainToInstance(ChatMessageResponseDto, message),
    );
  }

  @Put(':chatId')
  @ApiOperation({ summary: 'Update a chat' })
  @ApiResponse({
    status: 200,
    description: 'Chat updated successfully',
    type: ChatResponseDto,
  })
  async updateChat(
    @Param('chatId') chatId: string,
    @Body() updateChatDto: UpdateChatRequestDto,
    @Request() req: AuthenticatedRequestDto,
  ) {
    await this._checkChatACL({ chatId, req });
    const chat = await this.chatService.updateChat(chatId, updateChatDto);
    return plainToInstance(ChatResponseDto, chat);
  }

  @Delete(':chatId')
  @ApiOperation({ summary: 'Delete a chat' })
  @ApiResponse({ status: 204, description: 'Chat deleted successfully' })
  async deleteChat(
    @Param('chatId') chatId: string,
    @Request() req: AuthenticatedRequestDto,
  ) {
    await this._checkChatACL({ chatId, req });
    await this.chatService.deleteChat(chatId);
  }

  @Post('message')
  @ApiOperation({ summary: 'Send a message as a user' })
  @ApiResponse({
    status: 201,
    description: 'Message sent successfully',
  })
  async sendMessage(
    @Body() sendMessageDto: SendMessageRequestDto,
    @Request() req: AuthenticatedRequestDto,
  ) {
    // For non-admin users, verify they own the channel through the chat
    await this._checkChatACL({
      chatInternalIdentifier: sendMessageDto.chatInternalIdentifier,
      req,
    });

    await this.chatService.createMessage({
      ...sendMessageDto,
      sender: ChatSender.USER,
    });
  }

  // Helpers
  private async _checkChatACL({
    chatId,
    chatInternalIdentifier,
    req,
  }: {
    chatId?: string;
    chatInternalIdentifier?: string;
    req: AuthenticatedRequestDto;
  }): Promise<void> {
    if (req.isAdmin) return;
    if (!chatId && !chatInternalIdentifier) {
      throw new ChatNotFoundError();
    }
    const chat = chatId
      ? await this.chatService.findChatById(chatId)
      : await this.chatService.findChatByInternalIdentifier(
          chatInternalIdentifier!,
        );

    if (!chat) {
      throw new ChatNotFoundError();
    }

    const channel = await this.messageChannelService.findById(
      chat.messageChannelId,
    );

    if (!channel) {
      throw new MessageChannelNotFoundError(chat.messageChannelId);
    }

    if (channel.userId !== req.user.id) {
      throw new UnauthorizedError(
        'You do not have permission to access this chat',
      );
    }
  }

  private async _checkChannelACL({
    channelId,
    req,
  }: {
    channelId: string;
    req: AuthenticatedRequestDto;
  }) {
    if (req.isAdmin) return;

    const channel = await this.messageChannelService.findById(channelId);
    if (!channel) {
      throw new MessageChannelNotFoundError(channelId);
    }

    if (channel.userId !== req.user.id) {
      throw new UnauthorizedError(
        'You do not have permission to access chats for this channel',
      );
    }
  }
}
