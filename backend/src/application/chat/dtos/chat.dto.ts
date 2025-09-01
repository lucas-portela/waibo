import { z } from 'zod';

export const ChatDto = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  contact: z.string().min(1).max(100),
  internalIdentifier: z.string().min(1),
  messageChannelId: z.string().min(1),
  botMemory: z.coerce.string().max(300).optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
});

export type ChatDto = z.infer<typeof ChatDto>;
