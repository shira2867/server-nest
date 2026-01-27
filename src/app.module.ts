import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { JwtModule } from '@nestjs/jwt';
import { TileModule } from './tile/tile.module';
import { TileController } from './tile/tile.controller';
import { TileService } from './tile/tile.service';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from './pipe/zod-validation.pipe';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '12h' },
    }),
    UserModule,
    DatabaseModule,
    TileModule,
    AuthModule,
  ],
  controllers: [UserController, TileController,AuthController],
  providers: [UserService, TileService,AuthService],
})
export class AppModule {}
