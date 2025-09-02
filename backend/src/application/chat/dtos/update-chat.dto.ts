import { z } from 'zod';

export const UpdateChatDto = z.object({
  name: z.string().min(1).optional(),
  contact: z.string().min(1).optional(),
  botMemory: z.coerce.string().optional(),
});
export type UpdateChatDto = z.infer<typeof UpdateChatDto>;
