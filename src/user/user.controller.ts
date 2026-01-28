import { Controller, Get, Body, Param, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { Role } from '../types/enum.type';
import { JwtAuthGuard, RolesGuard } from '../guard/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { User } from './entities/user.entity';
import { EmailParamsDto, IdParamsDto, RoleParamsDto } from 'src/schemas/params.schema';
import { UpdateRoleDto } from './dto/update-user.dto';

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
    @Param() param: IdParamsDto,
  ): Promise<User | null> {
    return this.userService.getUserById(param.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Get('ByRole/:role')
  findByRole(
    @Param() param: RoleParamsDto,
  ): Promise<User[]> {
    return this.userService.getUserByRole(param.role);
  }

  @UseGuards(JwtAuthGuard)
  @Get('ByEmail/:email')
  findByEmail(
    @Param() param: EmailParamsDto,
  ): Promise<User | null> {
    return this.userService.getUserByEmail(param.email as string);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin)
  @Put('updateRole/:id')
  updateUserRole(
    @Param() param: IdParamsDto,
    @Body() data: UpdateRoleDto,
  ) {
    return this.userService.updateUserRole(param.id, data);
  }
}
