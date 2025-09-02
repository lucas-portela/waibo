import { z } from 'zod';

export const CreateBotIntentDto = z.object({
  botId: z.string().min(1),
  name: z.string().min(1).optional(),
  tag: z.string().min(1).optional(),
  trigger: z.string().min(1),
  response: z.string().min(1),
});

export type CreateBotIntentDto = z.infer<typeof CreateBotIntentDto>;
