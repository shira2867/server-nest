import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { Role } from '../types/enum.type';
import { createUserSchema, loginSchema, RoleSchema } from './schemas/auth.schema';
import type { CreateUserInput, LoginInput } from './schemas/auth.schema';
import { ZodValidationPipe } from '../pipe/zod-validation.pipe';
import type { Response } from 'express';
import { myUserPayloadDto } from '../user/dto/myUserPayload.dto';
import { JwtAuthGuard} from '../guard/auth.guard';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
interface AuthRequest extends Request {
  user?: myUserPayloadDto;
}

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}
  @Post('signUp')
  createUser(
    @Body(new ZodValidationPipe(createUserSchema)) userData: CreateUserInput,
  ) {
    return this.authService.createUser(userData);
  }
  @Post('login')
  async login(@Body(new ZodValidationPipe(loginSchema)) loginData: LoginInput, @Res() res: Response) {
    const result = await this.authService.login(loginData);
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
