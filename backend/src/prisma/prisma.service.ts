import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.js';
import type { EnvironmentVariables } from '../config/env.validation.js';

/**
 * Client Prisma unique de l'application (fourni par le `PrismaModule` global).
 * Prisma 7 : la connexion passe par le driver adapter `@prisma/adapter-pg`.
 */
@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor(config: ConfigService<EnvironmentVariables, true>) {
    super({
      adapter: new PrismaPg({
        connectionString: config.get('DATABASE_URL', { infer: true }),
      }),
    });
  }

  async onModuleInit(): Promise<void> {
    try {
      await this.$connect();
      // Avec un driver adapter, `$connect` n'ouvre pas forcément de connexion :
      // une requête triviale garantit l'échec immédiat si la base est injoignable.
      await this.$queryRaw`SELECT 1`;
    } catch (error) {
      throw new Error(
        `Connexion à PostgreSQL impossible (la base est-elle démarrée ? docker compose up -d) : ${
          error instanceof Error ? error.message : String(error)
        }`,
        { cause: error },
      );
    }
    this.logger.log('Connecté à PostgreSQL');
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
