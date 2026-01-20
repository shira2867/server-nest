import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { promises } from 'fs';
import { Role, UserDto } from './dto/user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('getAllUser')
  findAll() {
    return this.userService.getAllUsers();
  }
   @Get('getUserById/:id')
  findById(@Param('id') id:string):Promise<UserDto | null> {
    return this.userService.getUserById(id);
  }
     @Get('getUserByRole/:role')
  findByRole(@Param('role') role:Role):Promise<UserDto[] > {
    return this.userService.getUserByRole(role);
  }
@Put('updateUserRole/:id')
updateUserRole(@Param('id') id: string, @Body('role') role: Role) {
  return this.userService.updateUserRole(id, { role });
}

}
