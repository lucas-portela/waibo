import { z } from 'zod';

export const BotDto = z.object({
  id: z.string(),
  name: z.string(),
  prompt: z.string(),
  userId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type BotDto = z.infer<typeof BotDto>;
