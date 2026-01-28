import { z } from 'zod';
import { Role } from '../../user/dto/user.dto';

const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.email(),
  password: z.string().regex(
    passwordRegex,
    'הסיסמה חייבת להכיל לפחות 8 תווים, אות גדולה, אות קטנה, מספר ותו מיוחד'
  ),
role: z.enum(Role).optional().default(Role.viewer),
});


export const allowedrole = Role ;

export const RoleSchema = z.object({
  role: z.enum(allowedrole), 
});
export const loginSchema = createUserSchema.pick({
  email: true,
  password: true,
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type RoleInput = z.infer<typeof RoleSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
