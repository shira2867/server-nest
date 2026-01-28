import { CreateAuthDto } from './dto/create-auth.dto';
import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Collection, MongoClient } from 'mongodb';
import bcrypt from 'bcrypt';
import { UserDto } from '../user/dto/user.dto';
import { Role, User } from '../types/user.type';
import * as jwt from 'jsonwebtoken';
import { UserService } from 'src/user/user.service';
import { CreateUserInput, LoginInput } from './schemas/auth.schema';
@Injectable()
export class AuthService {
  private readonly usersCollection: Collection<UserDto>;

  constructor(
    @Inject('MONGO_CLIENT') private readonly client: MongoClient,
    private readonly userService: UserService,
  ) {
    const db = this.client.db('tiles');
    this.usersCollection = db.collection<UserDto>('users');
  }

  async createUser(userData: CreateUserInput) {
    let existingUser: User | null = null;

    try {
      existingUser = await this.userService.getUserByEmail(userData.email);
    } catch (err) {
      if (!(err instanceof NotFoundException)) {
        throw err;
      }
    }

    if (existingUser) {
      throw new BadRequestException(
        'Email already in use. Please go to login.',
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    try {
      const user: UserDto = {
        ...userData,
        password: hashedPassword,
        role: Role.viewer,
      };

      const result = await this.usersCollection.insertOne(user);
      const { password, ...cleanUser } = user;
      return cleanUser;
    } catch (error) {
      throw new Error('Failed to create user');
    }
  }

  async login(loginData: LoginInput) {
    try {
      const { email, password } = loginData;

      if (!email || !password) {
        throw new BadRequestException('Email and password are required');
      }
      const user = await this.usersCollection.findOne({ email });

      if (!user) {
        throw new BadRequestException('Invalid email or password');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new BadRequestException('Invalid email or password');
      }

      const token = jwt.sign(
        {
          _id: user._id,
          name: user.name,
          role: user.role,
          email: user.email,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: '1d' },
      );

      return {
        token,
        user: {
          id: user._id,
          name: user.name,
          role: user.role,
          email: user.email,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Login failed');
    }
  }
}
