import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MongoClient, ObjectId } from 'mongodb';
import { Color, TileDto } from './dto/tile.dto';
import { CreateTileDto } from './dto/create-tile.dto';


@Injectable()
export class TileService {
  constructor(@Inject('MONGO_CLIENT') private readonly client: MongoClient) {}

  async getAllTiles(): Promise<TileDto[]> {
    const db = this.client.db('tiles');
    const tiles = await db.collection<TileDto>('tiles').find().toArray();
    return tiles;
  }


  async updateTileColor(id: string, data: { color: Color }) {
    const db = this.client.db('tiles');
    const _id = new ObjectId(id);

    const result = await db
      .collection<TileDto>('tiles')
      .findOneAndUpdate({ _id }, { $set: data }, { returnDocument: 'after' });
 if (!result) {
    throw new NotFoundException('Tile not found');
  }
    return result;
  }

  async createTile(tileData: CreateTileDto) {
    const db = this.client.db('tiles');

    const tile: TileDto = {
      ...tileData,
    };

    const result = await db.collection<TileDto>('tiles').insertOne(tile);
    return { ...tile, _id: result.insertedId };
  }


 async deleteTile(id: string): Promise<TileDto> {
  const db = this.client.db('tiles');
  const _id = new ObjectId(id);

  const result = await db
    .collection<TileDto>('tiles')
    .findOneAndDelete({ _id });

  if (!result) {
    throw new NotFoundException('Tile not found');
  }

  return result;
}

}