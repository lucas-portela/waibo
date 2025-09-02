import { z } from 'zod';

export const UpdateMessageChannelDetailsDto = z.object({
  name: z.string().min(1).optional(),
  contact: z.string().min(1).optional(),
  type: z.string().min(1).optional(),
  botId: z.string().min(1).optional(),
});

export type UpdateMessageChannelDetailsDto = z.infer<
  typeof UpdateMessageChannelDetailsDto
>;
