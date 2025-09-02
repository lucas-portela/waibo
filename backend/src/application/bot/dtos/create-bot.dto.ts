import { z } from 'zod';

export const CreateBotDto = z.object({
  name: z.string().min(1),
  prompt: z.string().min(1),
  userId: z.string().min(1),
});

export type CreateBotDto = z.infer<typeof CreateBotDto>;
