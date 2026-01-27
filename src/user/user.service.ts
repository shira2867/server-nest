import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { MongoClient, ObjectId } from 'mongodb';
import { Role } from '../types/enum.type';
import {  objectIdSchema } from './schemas/user.schema';
import { User } from '../types/user.type';
import { UserDto } from '../user/dto/user.dto';

@Injectable()
export class UserService {
  constructor(@Inject('MONGO_CLIENT') private readonly client: MongoClient) {}

  async getAllUsers(): Promise<User[]> {
    const db = this.client.db('tiles');
    const users = await db.collection<UserDto>('users').find().toArray();
    return users.map(({ password, ...user }) => user);
  }

  async getUserById(id: string): Promise<User | null> {
    const db = this.client.db('tiles');
    const validatedId = objectIdSchema.parse(id);
    const _id = new ObjectId(validatedId);
    const user = await db.collection<UserDto>('users').findOne({ _id });
    if (!user) {
      return null;
    }
    const { password, ...cleanUser } = user;
    return cleanUser;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const db = this.client.db('tiles');

    const user = await db.collection<UserDto>('users').findOne({ email });

    if (!user) {
      return null;
    }
    const { password, ...cleanUser } = user;
    return cleanUser;
  }

  async getUserByRole(role: Role): Promise<User[]> {
    const db = this.client.db('tiles');
    const users = await db
      .collection<UserDto>('users')
      .find({ role })
      .toArray();
    return users.map(({ password, ...user }) => user);
  }
  async updateUserRole(id: string, data: { role: Role }) {
    try {
      const db = this.client.db('tiles');
      const _id = new ObjectId(id);
      const result = await db
        .collection<UserDto>('users')
        .findOneAndUpdate(
          { _id },
          { $set: { role: data.role } },
          { returnDocument: 'after' },
        );
      if (!result) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
    const { password, ...cleanUser } = result;
      return cleanUser;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Failed to update user2');
    }
  }
}
