import { z } from 'zod';

export const ChatMessageDto = z.object({
  id: z.string().min(1),
  chatId: z.string().min(1),
  sender: z.string().min(1),
  content: z.string().min(1),
  createdAt: z.coerce.date(),
});

export type ChatMessageDto = z.infer<typeof ChatMessageDto>;
