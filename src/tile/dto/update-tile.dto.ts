import { PartialType } from '@nestjs/mapped-types';
import { CreateTileDto } from './create-tile.dto';
import { Color } from './tile.dto';
import { createZodDto } from 'nestjs-zod';
import { colorSchema } from '../schemas/tile.schema';

export class UpdateTileDto  extends createZodDto(colorSchema) {

     

}
