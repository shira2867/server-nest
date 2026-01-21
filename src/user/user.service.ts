import { Inject, Injectable } from '@nestjs/common';
import { MongoClient, ObjectId } from 'mongodb';
import { Role, UserDto } from './dto/user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { LoginDto } from './dto/login.dto';

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
    const users = await db
      .collection<UserDto>('users')
      .find({ role })
      .toArray();
    return users;
  }
  async updateUserRole(id: string, data: { role: Role }) {
    const db = this.client.db('tiles');
    const _id = new ObjectId(id);

    const result = await db
      .collection<UserDto>('users')
      .findOneAndUpdate({ _id }, { $set: data }, { returnDocument: 'after' });

    return result;
  }

  async createUser(userData: CreateUserDto) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const db = this.client.db('tiles');

    const user: UserDto = {
      ...userData,
      password: hashedPassword,
      role: Role.viewer,
    };

    const result = await db.collection<UserDto>('users').insertOne(user);
    return { ...user, _id: result.insertedId };
  }

  async login(loginData:LoginDto) {
    const {email,password}=loginData
    const db = this.client.db('tiles');
    const user = await db.collection<UserDto>('users').findOne({ email });
    if(!user)
    {
         throw new Error('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid password');
    }
     const token = jwt.sign(
        { _id: user._id,name:user.name, role: user.role, email:user.email }, 
        process.env.JWT_SECRET as string, 
        { expiresIn: '1d' } 
    );
    return { 
        token, 
        user: { id: user._id, name: user.name, role: user.role,email: user.email } 
    };
  }
}
