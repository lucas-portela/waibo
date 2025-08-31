import { z } from 'zod';

export const UpdateMessageChannelDetailsDto = z.object({
  name: z.string().min(1).max(100).optional(),
  contact: z.string().min(1).max(100).optional(),
  type: z.string().min(1).max(50).optional(),
});

export type UpdateMessageChannelDetailsDto = z.infer<
  typeof UpdateMessageChannelDetailsDto
>;
