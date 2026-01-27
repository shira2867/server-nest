import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from 'src/guard/auth.guard';
import { UserModule } from 'src/user/user.module';

@Module({
    imports: [
      DatabaseModule,
       JwtModule.register({
        secret: process.env.JWT_SECRET,
      }),
       UserModule,
     
            

    ],
  controllers: [AuthController],
  providers: [AuthService,JwtAuthGuard],
    exports: [AuthService, JwtAuthGuard],
  
})
export class AuthModule {}
