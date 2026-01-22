import { Module } from '@nestjs/common';
import { TileService } from './tile.service';
import { TileController } from './tile.controller';
import { DatabaseModule } from 'src/database/database.module';
import { JwtAuthGuard, RolesGuard } from 'src/guard/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';

@Module({
  imports:[DatabaseModule,JwtModule.register({
        secret: process.env.JWT_SECRET,
      }),UserModule
  ],
  controllers: [TileController],
  providers: [TileService],
})
export class TileModule {}
