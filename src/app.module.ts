import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';

@Module({
  imports: [UserModule, ConfigModule.forRoot({
      isGlobal: true, 
    }),
    DatabaseModule,],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
