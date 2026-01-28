import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Collection, MongoClient, ObjectId } from 'mongodb';
import { Color, TileDto } from './dto/tile.dto';
import { CreateTileInput } from './schemas/tile.schema';
import { Tile } from 'src/types/tile.type';

@Injectable()
export class TileService {
  private readonly tilesCollection: Collection<TileDto>;

  constructor(@Inject('MONGO_CLIENT') private readonly client: MongoClient) {
    const db = this.client.db('tiles');
    this.tilesCollection = db.collection<TileDto>('tiles');
  }

  async getAllTiles(): Promise<Tile[]> {
    try {
      const tiles = await this.tilesCollection.find().toArray();

      return tiles;
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch  from database');
    }
  }

  async createTile(tileData: CreateTileInput) {
    try {
      const newTile = {
        ...tileData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await this.tilesCollection.insertOne(newTile);

      return { ...newTile, _id: result.insertedId };
    } catch (error) {
      throw new Error('Failed to create tile');
    }
  }

  async deleteTile(id: string): Promise<Tile> {
    try {
      const _id = new ObjectId(id);
      const result = await this.tilesCollection.findOneAndDelete({ _id });

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
      const _id = new ObjectId(id);
      const result = await this.tilesCollection.findOneAndUpdate(
        { _id },
        { $set: { ...data, updatedAt: new Date() } },
        { returnDocument: 'after' },
      );

      if (!result) {
        throw new NotFoundException(`Tile with ID ${id} not found`);
      }

      return result;
    } catch (error) {
      console.error('UpdateTileColor Error:', error);

      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new Error(`Internal Update Error: ${error.message}`);
    }
  }
}
