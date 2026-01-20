import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoClient } from 'mongodb';

@Module({
  providers: [
    {
      provide: 'MONGO_CLIENT',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const uri = configService.get('MONGO_URI');
        const client = new MongoClient(uri);
        await client.connect();
        return client;
      },
    },
  ],
  exports: ['MONGO_CLIENT'],
})
export class DatabaseModule {}

