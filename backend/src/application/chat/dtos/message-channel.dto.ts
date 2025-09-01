import { MessageChannelStatus } from 'src/domain/chat/entities/message-channel.entity';
import { z } from 'zod';

export const MessageChannelDto = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  contact: z.string().min(1).max(100),
  type: z.string().min(1).max(50),
  status: z.enum(MessageChannelStatus),
  userId: z.string().min(1),
  botId: z.string().min(1),
  sessionId: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
});

export type MessageChannelDto = z.infer<typeof MessageChannelDto>;
