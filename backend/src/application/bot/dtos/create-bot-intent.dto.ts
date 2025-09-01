import { z } from 'zod';

export const CreateBotIntentDto = z.object({
  botId: z.string().min(1),
  tag: z.string().min(1).max(100),
  name: z.string().min(1).max(100),
  trigger: z.string().min(1).max(500),
  response: z.string().min(1).max(1000),
});

export type CreateBotIntentDto = z.infer<typeof CreateBotIntentDto>;
