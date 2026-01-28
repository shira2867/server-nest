import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  UsePipes,
} from '@nestjs/common';
import { TileService } from './tile.service';
import { CreateTileDto } from './dto/create-tile.dto';
import { JwtAuthGuard, RolesGuard } from 'src/guard/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from '../types/enum.type';
import { IdParamsDto } from 'src/schemas/params.schema';
import { UpdateTileDto } from './dto/update-tile.dto';
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
  @Put('updateTile/:id')
  updateUserRole(@Param() id: IdParamsDto, @Body() data: UpdateTileDto) {
    return this.tileService.updateTileColor(id.id, data);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin, Role.moderator)
  @Post('createTile')
  createTiles(@Body() tileData: CreateTileDto) {
    return this.tileService.createTile(tileData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.admin, Role.moderator)
  @Delete('deleteTile/:id')
  deleteTile(@Param() param: IdParamsDto) {
    return this.tileService.deleteTile(param.id);
  }
}
