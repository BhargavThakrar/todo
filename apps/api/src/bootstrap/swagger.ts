import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swaggerInit = (app: NestExpressApplication) => {
  const config = new DocumentBuilder()
    .setTitle('Todo API')
    .setDescription('Todo management')
    .setVersion('1.0')
    .addServer('http://localhost:3000', 'Local server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
};
