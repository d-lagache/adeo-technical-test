import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module.js';
import type { EnvironmentVariables } from './config/env.validation.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService<EnvironmentVariables, true>);

  app.setGlobalPrefix('api/v1');
  // whitelist : supprime les propriétés non déclarées dans les DTO ;
  // transform : convertit les paramètres (ex. `limit` en entier) vers leur type déclaré.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({ origin: config.get('CORS_ORIGIN', { infer: true }) });

  await app.listen(config.get('PORT', { infer: true }));
}
await bootstrap();
