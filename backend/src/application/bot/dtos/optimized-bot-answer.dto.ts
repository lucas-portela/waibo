import { z } from 'zod';

export const OptimizedBotAnswerDto = z.object({
  triggered_intent: z.string().trim().min(1).nullable(),
  memory_update: z.string().trim().min(1).nullable(),
  response: z.string().trim().min(1).nullable(),
});

export type OptimizedBotAnswerDto = z.infer<typeof OptimizedBotAnswerDto>;
