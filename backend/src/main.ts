import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  // Documentation générée depuis le code : UI sur /api/docs, JSON OpenAPI sur /api/docs-json
  // (chemins hors préfixe global, SwaggerModule.setup ne l'applique pas).
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder()
      .setTitle('Adeo Catalogue API')
      .setDescription(
        'Catalogue de produits avec leurs avis clients : liste et détail des produits, avis, classements (plus appréciés, moins bien notés) et indicateurs globaux.',
      )
      .setVersion('1.0')
      .build(),
  );
  SwaggerModule.setup('api/docs', app, document, {
    jsonDocumentUrl: 'api/docs-json',
  });

  await app.listen(config.get('PORT', { infer: true }));
}
await bootstrap();
