import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ApiModule } from './api.module';
import { initApp } from './bootstrap';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(ApiModule);
  initApp(app);
  await app.listen(3000);
}
bootstrap();
