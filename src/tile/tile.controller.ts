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
import { Role } from 'src/user/dto/user.dto';
import { Color } from './dto/tile.dto';
import {
  colorSchema,
  tileSchema,
} from './schemas/tile.schema';
import { ZodValidationPipe } from 'src/pipe/zod-validation.pipe';

@Controller('tiles')
export class TileController {
  constructor(private readonly tileService: TileService) {}

  @UseGuards(JwtAuthGuard)
  @Get('getAllTiles')
  findAll() {
    return this.tileService.getAllTiles();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin, Role.moderator, Role.editor)
  @Put('updateTile/:tileId')
  updateUserRole(@Param('tileId') id: string, @Body('color') color: Color) {
    const colorValidate = colorSchema.safeParse({ color });
    if (!colorValidate.success) {
      return { success: false, error: colorValidate.error };
    }
    return this.tileService.updateTileColor(id, colorValidate.data);
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
  deleteTile(@Param('tileId') id: string) {
    return this.tileService.deleteTile(id);
  }
}
