import { IsString,IsEmail,MinLength,IsEnum } from "class-validator";
export enum Role {
  admin = 'admin',
  moderator = 'moderator',
  editor = 'editor',
  viewer = 'viewer',
}
export class UserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

 @IsEnum(Role)
  role: Role;
}


