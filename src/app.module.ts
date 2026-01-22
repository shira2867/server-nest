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

@Module({
  imports: [UserModule, ConfigModule.forRoot({
      isGlobal: true, 
    }),
    DatabaseModule,
  JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '12h' },
    }),
  TileModule,],
  controllers: [UserController,TileController],
  providers: [UserService,TileService],
})
export class AppModule {}
