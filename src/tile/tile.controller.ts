import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
} from '@nestjs/common';
import { TileService } from './tile.service';
import { CreateTileDto } from './dto/create-tile.dto';
import { JwtAuthGuard, RolesGuard } from 'src/guard/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '../types/enum.type';
import { Color } from './dto/tile.dto';
import { colorSchema, objectIdSchema, tileSchema } from './schemas/tile.schema';
import type { ColorInput } from './schemas/tile.schema';
import { ZodValidationPipe } from 'src/pipe/zod-validation.pipe';

@Controller('tiles')
export class TileController {
  constructor(private readonly tileService: TileService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.tileService.getAllTiles();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin, Role.moderator, Role.editor)
  @Put('updateTile/:tileId')
  updateUserRole(
    @Param('tileId', new ZodValidationPipe(objectIdSchema)) id: string,
    @Body(new ZodValidationPipe(colorSchema)) colorData: ColorInput,
  ) {
    return this.tileService.updateTileColor(id, colorData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin, Role.moderator)
  @Post('createTile')
  createTiles(
    @Body(new ZodValidationPipe(tileSchema))
    tileData: CreateTileDto,
  ) {
    return this.tileService.createTile(tileData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin, Role.moderator)
  @Delete('deleteTile/:tileId')
  deleteTile(@Param('tileId', new ZodValidationPipe(objectIdSchema)) id: string) {
    return this.tileService.deleteTile(id);
  }
}
