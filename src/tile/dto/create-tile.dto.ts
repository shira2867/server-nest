
import { createZodDto } from "nestjs-zod";
import { tileSchema } from "../schemas/tile.schema";

export class CreateTileDto extends createZodDto(tileSchema) {



}

