import { z } from 'zod';

export const ChatDto = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(100),
  contact: z.string().min(1).max(100),
  internalIdentifier: z.string().min(1),
  messageChannelId: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date().optional(),
});

export type ChatDto = z.infer<typeof ChatDto>;
