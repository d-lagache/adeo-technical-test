// Configuration de la CLI Prisma 7 (schéma, migrations, connexion).
// Prisma 7 ne charge plus `.env` automatiquement : dotenv s'en charge ici.
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
