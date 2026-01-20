import { Inject, Injectable } from '@nestjs/common';
import { MongoClient, ObjectId } from 'mongodb';
import { Role, UserDto } from './dto/user.dto';
import { promises } from 'dns';

@Injectable()
export class UserService {
  constructor(@Inject('MONGO_CLIENT') private readonly client: MongoClient) {}

  async getAllUsers(): Promise<UserDto[]> {
    const db = this.client.db('tiles');
    const users = await db.collection<UserDto>('users').find().toArray();
    return users;
  }

  async getUserById(id: string): Promise<UserDto | null> {
    const db = this.client.db('tiles');
    const _id = new ObjectId(id);
    const user = await db.collection<UserDto>('users').findOne({ _id });
    return user;
  }

  async getUserByRole(role: Role): Promise<UserDto[]> {
  const db = this.client.db('tiles');
  const users = await db.collection<UserDto>('users').find({ role }).toArray();
  return users;
}
async updateUserRole(id: string, data: { role: Role }) {
  const db = this.client.db('tiles');
  const _id = new ObjectId(id);

  const result = await db
    .collection<UserDto>('users')
    .findOneAndUpdate(
      { _id },          
      { $set: data },   
      { returnDocument: 'after' }  
    );

  return result;  
}


}
