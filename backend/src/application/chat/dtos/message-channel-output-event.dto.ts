import { z } from 'zod';
import { MessageChannelDto } from './message-channel.dto';
import { ChatDto } from './chat.dto';
import { ChatMessageDto } from './chat-message.dto';

export const MessageChannelOutputEventDto = z.object({
  channel: MessageChannelDto,
  chat: ChatDto,
  message: ChatMessageDto,
});

export type MessageChannelOutputEventDto = z.infer<
  typeof MessageChannelOutputEventDto
>;
