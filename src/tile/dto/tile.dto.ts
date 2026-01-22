import { IsDate, IsEnum } from 'class-validator';

export enum Color {
  color1 = '#E98652',
  color2 = '#F9D5A7',
  color3 = '#FFB085',
  color4 = '#FEF1E6',
}

export class TileDto {
  @IsEnum(Color)
  color: Color;

  @IsDate()
  createdAt?: Date;
  updatedAt?: Date;
}
