import { z } from 'zod';

export const UpdateChatDto = z.object({
  name: z.string().min(1).max(100).optional(),
  contact: z.string().min(1).max(100).optional(),
  botMemory: z.coerce.string().max(300).optional(),
});
export type UpdateChatDto = z.infer<typeof UpdateChatDto>;
