import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseModule } from 'src/database/database.module';
import { AuthorizeRoleGuard, JwtAuthGuard } from 'src/guard/auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtAuthGuard],
})
export class UserModule {}
