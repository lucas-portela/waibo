import { UserRole } from 'src/domain/user/entities/user.entity';
import { z } from 'zod';

export const CreateUserDto = z.object({
  username: z.string().min(3),
  name: z.string().min(3),
  password: z.string().min(6),
  role: z.enum(UserRole).optional(),
});

export type CreateUserDto = z.infer<typeof CreateUserDto>;
