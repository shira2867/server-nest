import { z } from 'zod';
import { Color } from '../dto/tile.dto';


export const tileSchema = z.object({
  
  color: z.enum(["#E98652", "#F9D5A7", "#FFB085","#FEF1E6"]).optional().default("#FEF1E6"),
});


export const allowedColor = Color ;

export const colorSchema = z.object({
  color: z.enum(allowedColor), 
});

export type CreateTileInput = z.infer<typeof tileSchema>;
export type ColorInput = z.infer<typeof colorSchema>;
