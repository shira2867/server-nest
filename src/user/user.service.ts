import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Collection, MongoClient, ObjectId } from 'mongodb';
import { Role } from '../types/enum.type';
import { User } from '../types/user.type';
import { UserDto } from '../user/dto/user.dto';

@Injectable()
export class UserService {
  private readonly usersCollection: Collection<UserDto>;
  constructor(@Inject('MONGO_CLIENT') private readonly client: MongoClient) {
    const db = this.client.db('tiles');
    this.usersCollection = db.collection<UserDto>('users');
  }
  async getAllUsers(): Promise<User[]> {
    try {
      const users = await this.usersCollection.find().toArray();
      return users.map(({ password, ...user }) => user);
    } catch {
      throw new InternalServerErrorException('Failed to fetch  from database');
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
     
      const _id = new ObjectId(id);
      const user = await this.usersCollection.findOne({ _id });
      if (!user) {
        return null;
      }
      const { password, ...cleanUser } = user;
      return cleanUser;
    } catch {
      throw new InternalServerErrorException('Failed to fetch  from database');
    }
  }

  async getUserByEmail(email: string): Promise<User> {
  

    const user = await this.usersCollection.findOne({ email });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    const { password, ...cleanUser } = user;
    return cleanUser;
  }

  async getUserByRole(role: Role): Promise<User[]> {
    try {
      
      const users = await this.usersCollection
        .find({ role })
        .toArray();
      return users.map(({ password, ...user }) => user);
    } catch {
      throw new InternalServerErrorException('Failed to fetch  from database');
    }
  }
  async updateUserRole(id: string, data: { role: Role }) {
    try {
     
      const _id = new ObjectId(id);
      const result = await this.usersCollection
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
