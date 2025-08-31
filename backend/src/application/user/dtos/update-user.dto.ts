import { z } from 'zod';

export const UpdateUserDto = z.object({
  username: z.string().min(3).max(30).optional(),
  name: z.string().min(3).max(100).optional(),
  password: z.string().min(6).max(100).optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserDto>;
