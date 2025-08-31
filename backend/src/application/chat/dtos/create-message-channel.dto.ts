import { MessageChannelStatus } from 'src/domain/chat/entities/message-channel.entity';
import { z } from 'zod';

export const CreateMessageChannelDto = z.object({
  name: z.string().min(1).max(100),
  contact: z.string().min(1).max(100),
  type: z.string().min(1).max(50),
  status: z.enum(MessageChannelStatus).optional(),
  userId: z.string().min(1),
  botId: z.string().min(1),
  sessionId: z.string().optional(),
});

export type CreateMessageChannelDto = z.infer<typeof CreateMessageChannelDto>;
