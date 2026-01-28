import { IsString,IsEmail,MinLength } from "class-validator";
import { loginSchema } from "../schemas/auth.schema";
import { createZodDto } from "nestjs-zod";

export class LoginDto extends createZodDto(loginSchema)  {

}