import { z } from 'zod';

export const CreateBotDto = z.object({
  name: z.string().min(1).max(100),
  prompt: z.string().min(1).max(2000),
  userId: z.string().min(1),
});

export type CreateBotDto = z.infer<typeof CreateBotDto>;
