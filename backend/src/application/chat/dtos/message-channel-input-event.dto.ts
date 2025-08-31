import { z } from 'zod';
import { MessageChannelDto } from './message-channel.dto';
import { ChatDto } from './chat.dto';
import { ChatMessageDto } from './chat-message.dto';

export const MessageChannelInputEventDto = z.object({
  channel: MessageChannelDto,
  chat: ChatDto,
  message: ChatMessageDto,
});

export type MessageChannelInputEventDto = z.infer<
  typeof MessageChannelInputEventDto
>;
