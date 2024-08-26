import type { NestExpressApplication } from '@nestjs/platform-express';
import { swaggerInit } from './swagger';
import { allowOrigin } from './cors';
import { seed } from './seed';

export const initApp = (app: NestExpressApplication) => {
  seed(app);
  allowOrigin(app);
  swaggerInit(app);
};
