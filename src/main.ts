import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerCustomOptions,
} from '@nestjs/swagger';
import * as cors from 'cors';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors());

  const configService = app.get(ConfigService);
  const JWT_SECRET = configService.get('JWT_SECRET');
  const swaggerCustomOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      persistAuthorization: true,
    },
  };
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('Swagger API')
    .setDescription('Swagger API Document')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' },
      JWT_SECRET,
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/v1', app, document, swaggerCustomOptions);

  await app.listen(3000);
  Logger.log(`Application running on http://localhost:${3000}`);
}
bootstrap();
