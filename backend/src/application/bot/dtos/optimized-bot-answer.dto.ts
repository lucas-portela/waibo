import { z } from 'zod';

export const OptimizedBotAnswerDto = z.object({
  triggered_intent: z.string().trim().min(1).max(100).nullable(),
  memory_update: z.string().trim().min(1).max(200).nullable(),
  response: z.string().trim().min(1).max(2000).nullable(),
});

export type OptimizedBotAnswerDto = z.infer<typeof OptimizedBotAnswerDto>;
