import { date, z } from 'zod';
import { Color } from '../dto/tile.dto';
import { ObjectId } from 'mongodb';

export const tileSchema = z.object({
  color: z.enum(Color).optional().default(Color.color1),
});

export const allowedColor = Color;

export const colorSchema = z.object({
  color: z.enum(allowedColor),
});
export const objectIdSchema = z
  .string()
  .refine((val) => ObjectId.isValid(val), {
    message: 'ID לא תקין',
  });
export type CreateTileInput = z.infer<typeof tileSchema>;
export type ColorInput = z.infer<typeof colorSchema>;
