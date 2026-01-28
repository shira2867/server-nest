import { IsString,IsEmail,MinLength } from "class-validator";
import { createZodDto } from 'nestjs-zod';
import { createUserSchema } from "src/auth/schemas/auth.schema";

export class CreateUserDto extends createZodDto(createUserSchema) {
 
}