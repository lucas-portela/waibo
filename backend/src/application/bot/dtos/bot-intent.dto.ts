import { z } from 'zod';

export const BotIntentDto = z.object({
  id: z.string().min(1),
  botId: z.string().min(1),
  tag: z.string().max(100),
  name: z.string().max(100),
  trigger: z.coerce.string().max(500),
  response: z.coerce.string().max(1000),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
});

export type BotIntentDto = z.infer<typeof BotIntentDto>;
