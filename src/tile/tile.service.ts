import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MongoClient, ObjectId } from 'mongodb';
import { Color, TileDto } from './dto/tile.dto';
import { CreateTileDto } from './dto/create-tile.dto';
import { date } from 'zod';
import { CreateTileInput, objectIdSchema } from './schemas/tile.schema';
import { Tile } from 'src/types/tile.type';

@Injectable()
export class TileService {
  constructor(@Inject('MONGO_CLIENT') private readonly client: MongoClient) {}

  async getAllTiles(): Promise<Tile[]> {
    const db = this.client.db('tiles');
    const tiles = await db.collection<TileDto>('tiles').find().toArray();
    console.log({ tiles });

    return tiles;
  }

  async createTile(tileData: CreateTileInput) {
    try {
      const db = this.client.db('tiles');
      const newTile = {
        ...tileData,
        createdAt: new Date(), 
        updatedAt: new Date(),
      };
     const result = await db
      .collection('tiles')
      .insertOne(newTile);

      return { ...newTile, _id: result.insertedId };
  } catch (error) {
    throw new Error('Failed to create tile');
  }
  }

  async deleteTile(id: string): Promise<Tile> {
    try {
      const db = this.client.db('tiles');
      const validatedId = objectIdSchema.parse(id);
      const _id = new ObjectId(validatedId);
      const result = await db
        .collection<TileDto>('tiles')
        .findOneAndDelete({ _id });

      if (!result) {
        throw new NotFoundException('Failed to delete tile');
      }

      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to delete tile');
    }
  }

  async updateTileColor(id: string, data: { color: Color }) {
  try {
    const validatedId = objectIdSchema.parse(id);
    const _id = new ObjectId(validatedId);
    
    const db = this.client.db('tiles');

    const result = await db
      .collection<TileDto>('tiles')
      .findOneAndUpdate(
        { _id }, 
        { $set: { ...data, updatedAt: new Date() } }, 
        { returnDocument: 'after' }
      );

    if (!result) {
      throw new NotFoundException(`Tile with ID ${id} not found`);
    }

    return result;
  } catch (error) {
    console.error('UpdateTileColor Error:', error);

    if (error instanceof NotFoundException ) {
      throw error; 
    }
    
    throw new Error(`Internal Update Error: ${error.message}`);
  }
}
}
