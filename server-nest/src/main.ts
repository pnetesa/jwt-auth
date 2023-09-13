import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  });
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  const PORT = process.env.PORT || 3001;
  await app.listen(PORT, () =>
    console.log(`Server is listening on port ${PORT}`),
  );
}

bootstrap();
