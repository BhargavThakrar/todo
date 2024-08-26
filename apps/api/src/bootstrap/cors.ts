import type { NestExpressApplication } from '@nestjs/platform-express';

export const allowOrigin = (app: NestExpressApplication) => {
  // We could add the dev environment check here before applying the cors setting
  app.enableCors({
    origin: /(localhost):[0-9]{4}/,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });
};
