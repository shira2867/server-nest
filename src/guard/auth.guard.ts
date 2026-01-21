import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { myUserPayloadDto } from 'src/user/dto/myUserPayload.dto';
import { UserService } from 'src/user/user.service';
import {allowedrole} from '../user/schemas/user.schema'
import { Role } from 'src/user/dto/user.dto';


export const ALLOWED_ROLES = 'ALLOWED_ROLES';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    const token = request.cookies?.token;

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const decoded = this.jwtService.verify<myUserPayloadDto>(token, {
        secret: process.env.JWT_SECRET,
      });

      if (!this.jwtService.decode) {
        throw new UnauthorizedException('error');
      }
      const payload = decoded;
      console.log('user payload', payload);
      const user = await this.userService.getUserById(payload._id);
      if (!user || user.role !== payload.role) {
        response.clearCookie('token');
        throw new UnauthorizedException('User data changed');
      }
      request['user'] = user;
      return true;
    } catch {
      throw new ForbiddenException('Invalid token');
    }
  }
}

@Injectable()
export class AuthorizeRoleGuard implements CanActivate {
  constructor(  @Inject(ALLOWED_ROLES) private  allowedRoles: Role[]) {}
  async canActivate(context: ExecutionContext):Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    if (!this.allowedRoles.includes(user.role)) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
