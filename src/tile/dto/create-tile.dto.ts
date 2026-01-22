

import { IsEnum } from "class-validator";
import { Color } from "./tile.dto";

export class CreateTileDto {

@IsEnum(Color)
color:Color

}

