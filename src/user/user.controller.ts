import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Res,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Role, UserDto } from './dto/user.dto';
import { createUserSchema, RoleSchema } from './schemas/user.schema';
import type { CreateUserInput } from './schemas/user.schema';
import { ZodValidationPipe } from '../pipe/zod-validation.pipe';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';
import { get } from 'http';
import { myUserPayloadDto } from './dto/myUserPayload.dto';
import { JwtAuthGuard ,AuthorizeRoleGuard} from '../guard/auth.guard';
import { error } from 'console';

interface AuthRequest extends Request {
  user?: myUserPayloadDto;
}
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('getAllUser')
  findAll() {
    return this.userService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Get('getUserById/:id')
  findById(@Param('id') id: string): Promise<UserDto | null> {
    return this.userService.getUserById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getUserByRole/:role')
  findByRole(@Param('role') role: Role): Promise<UserDto[]> {
    return this.userService.getUserByRole(role);
  }

  @UseGuards(JwtAuthGuard)
  @Put('updateRole/:id')
  updateUserRole(@Param('id') id: string, @Body('role') role: Role) {
    const roleValidate=RoleSchema.safeParse({role})
    if(!roleValidate.success)
    {
          return { success: false,error:roleValidate.error};

    }
  return this.userService.updateUserRole(id,  roleValidate.data  );
  }

  @Post('signUp')
  createUser(
    @Body(new ZodValidationPipe(createUserSchema))
    userData: CreateUserInput,
  ) {
    return this.userService.createUser(userData);
  }
  @Post('login')
  async login(@Body() loginData: LoginDto, @Res() res: Response) {
    const { email, password } = loginData;

    if (!email || !password) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Email and password are required' });
    }
    try {
      const result = await this.userService.login(loginData);
      console.log('token', result.token);
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 1000 * 12,
      });
      return res.status(200).json({
        message: 'Login successful',
        ...result,
      });
    } catch (error: any) {
      const errorMessage = error.message || 'Internal Server Error';
      const statusCode =
        errorMessage === 'User not found' || errorMessage === 'Invalid password'
          ? 401
          : 500;

      return res.status(statusCode).json({ message: errorMessage });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  logout(@Res() res: Response) {
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
    });
    res.status(200).json({ message: 'Logged out successfully' });
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getCurrentUser(@Req() req: AuthRequest, @Res() res: Response) {
    if (!req.user) return res.status(401).send();

    res.status(200).json({
      success: true,
      data: {
        _id: req.user._id,
        name: req.user.name,
        role: req.user.role,
        email: req.user.email,
      },
    });
  }
}
