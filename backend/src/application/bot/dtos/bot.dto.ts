import { z } from 'zod';

export const BotDto = z.object({
  id: z.string(),
  name: z.string(),
  prompt: z.string(),
  userId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type BotDto = z.infer<typeof BotDto>;
