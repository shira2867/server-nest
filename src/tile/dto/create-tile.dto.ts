

import { IsDate, IsEnum } from "class-validator";
import { Color } from "./tile.dto";

export class CreateTileDto {

@IsEnum(Color)
color:Color

@IsDate()
createdAt:Date

}

