import { email, z } from 'zod';
import { ObjectId } from 'mongodb';
import { createZodDto } from 'nestjs-zod';
import { EmailSchema, RoleSchema } from 'src/user/schemas/user.schema';

export const objectIdSchema = z
  .string()
  .refine((val) => ObjectId.isValid(val), {
    message: 'ID לא תקין',
  });

export class IdParamsDto extends createZodDto(
    z.object({
    id: objectIdSchema,
  }),
) {}

export class RoleParamsDto extends createZodDto(RoleSchema){

}
export class EmailParamsDto extends createZodDto(EmailSchema){
  
}
