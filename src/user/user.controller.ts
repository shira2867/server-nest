import { Controller, Get, Body, Param, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Role } from '../types/enum.type';
import { myUserPayloadDto } from './dto/myUserPayload.dto';
import { JwtAuthGuard, RolesGuard } from '../guard/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from './entities/user.entity';
import {
  EmailSchema,
  objectIdSchema,
  RoleEnumSchema,
  RoleSchema,
} from './schemas/user.schema';
import type { RoleInput } from './schemas/user.schema';

import { ZodValidationPipe } from 'src/pipe/zod-validation.pipe';

interface AuthRequest extends Request {
  user?: myUserPayloadDto;
}

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Get()
  findAll() {
    return this.userService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Get('/:id')
  findById(
    @Param('id', new ZodValidationPipe(objectIdSchema)) id: string,
  ): Promise<User | null> {
    return this.userService.getUserById(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Get('ByRole/:role')
  findByRole(
    @Param('role', new ZodValidationPipe(RoleEnumSchema)) role: Role,
  ): Promise<User[]> {
    return this.userService.getUserByRole(role);
  }

  @UseGuards(JwtAuthGuard)
  @Get('ByEmail/:email')
  findByEmail(
    @Param('email', new ZodValidationPipe(EmailSchema)) email: string,
  ): Promise<User | null> {
    return this.userService.getUserByEmail(email);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Put('updateRole/:id')
  updateUserRole(
    @Param('id', new ZodValidationPipe(objectIdSchema)) id: string,
    @Body(new ZodValidationPipe(RoleSchema)) data: RoleInput,
  ) {
    return this.userService.updateUserRole(id, data);
  }
}
