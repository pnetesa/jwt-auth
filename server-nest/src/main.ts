import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'process';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = process.env.port || 3000;
  await app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
}

bootstrap();
