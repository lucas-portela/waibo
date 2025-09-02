import { z } from 'zod';

export const UpdateBotDto = z.object({
  name: z.string().min(1).optional(),
  prompt: z.string().min(1).optional(),
});

export type UpdateBotDto = z.infer<typeof UpdateBotDto>;
