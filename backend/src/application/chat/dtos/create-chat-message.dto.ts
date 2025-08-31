import { ChatSender } from 'src/domain/chat/entities/chat-message.entity';
import { z } from 'zod';

export const CreateChatMessageDto = z.object({
  chatId: z.string().min(1),
  sender: z.enum(ChatSender),
  content: z.string().min(1),
});

export type CreateChatMessageDto = z.infer<typeof CreateChatMessageDto>;
