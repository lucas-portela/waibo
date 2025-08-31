import { UserRole } from 'src/domain/user/entities/user.entity';
import { z } from 'zod';

export const UserDto = z.object({
  id: z.string().nonempty().nonoptional(),
  username: z.string().min(3).max(30),
  name: z.string().min(3).max(100),
  password: z.string().min(6).max(100),
  role: z.enum(Object.values(UserRole)).default(UserRole.USER),
});

export type UserDto = z.infer<typeof UserDto>;
