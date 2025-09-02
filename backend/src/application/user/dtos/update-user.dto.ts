import { z } from 'zod';

export const UpdateUserDto = z.object({
  username: z.string().min(3).optional(),
  name: z.string().min(3).optional(),
  password: z.string().min(6).optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserDto>;
