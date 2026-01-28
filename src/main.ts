import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { ZodValidationPipe } from 'nestjs-zod';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalPipes(new ZodValidationPipe());
  const configService = app.get(ConfigService);
  const port = configService.get('PORT') || 3000;

  app.enableCors({
    origin: configService.get('ORIGIN'),
    credentials: true,
  });
  app.use(cookieParser());
  await app.listen(port);
}

bootstrap();
