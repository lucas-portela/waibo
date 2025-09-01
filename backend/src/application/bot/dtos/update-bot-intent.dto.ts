import { z } from 'zod';

export const UpdateBotIntentDto = z.object({
  tag: z.string().min(1).max(100).optional(),
  name: z.string().min(1).max(100).optional(),
  trigger: z.string().min(1).max(500).optional(),
  response: z.string().min(1).max(1000).optional(),
});

export type UpdateBotIntentDto = z.infer<typeof UpdateBotIntentDto>;
