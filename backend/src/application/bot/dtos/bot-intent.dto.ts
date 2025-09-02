import { z } from 'zod';

export const BotIntentDto = z.object({
  id: z.string().min(1),
  botId: z.string().min(1),
  tag: z.string(),
  name: z.string(),
  trigger: z.coerce.string(),
  response: z.coerce.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
});

export type BotIntentDto = z.infer<typeof BotIntentDto>;
