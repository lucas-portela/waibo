import { z } from 'zod';

export const CreateChatDto = z.object({
  name: z.string().min(1).max(100),
  contact: z.string().min(1).max(100),
  messageChannelId: z.string().min(1),
  internalIdentifier: z.string().min(1),
});
export type CreateChatDto = z.infer<typeof CreateChatDto>;
