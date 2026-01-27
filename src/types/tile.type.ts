import { ObjectId } from 'mongodb';
import { Color } from 'src/tile/dto/tile.dto';

export type Tile = {
  _id: ObjectId;
  color: Color;
  craeteAt?: Date;
  updateAt?: Date;
};
