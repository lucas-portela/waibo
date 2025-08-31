import { z } from 'zod';
export const ValidateUserCredentialsDto = z.object({
  username: z.string().trim().nonempty('Invalid username'),
  password: z.string().trim().nonempty('Invalid password'),
});

export type ValidateUserCredentialsDto = z.infer<
  typeof ValidateUserCredentialsDto
>;
