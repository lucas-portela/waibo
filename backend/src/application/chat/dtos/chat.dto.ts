import { z } from 'zod';

export const ChatDto = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  contact: z.string().min(1),
  internalIdentifier: z.string().min(1),
  messageChannelId: z.string().min(1),
  botMemory: z.coerce.string().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
});

export type ChatDto = z.infer<typeof ChatDto>;
