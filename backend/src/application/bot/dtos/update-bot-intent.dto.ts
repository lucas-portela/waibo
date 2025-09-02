import { z } from 'zod';

export const UpdateBotIntentDto = z.object({
  tag: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  trigger: z.string().min(1).optional(),
  response: z.string().min(1).optional(),
});

export type UpdateBotIntentDto = z.infer<typeof UpdateBotIntentDto>;
