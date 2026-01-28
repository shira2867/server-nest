import {  z } from 'zod';
import { Color } from '../dto/tile.dto';


export const tileSchema = z.object({
  color: z.enum(Color).optional().default(Color.color1),
});

export const allowedColor = Color;

export const colorSchema = z.object({
  color: z.enum(Color),
});



export type CreateTileInput = z.infer<typeof tileSchema>;
 
