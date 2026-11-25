// Configuration de la CLI Prisma 7 (schéma, migrations, connexion).
// Prisma 7 ne charge plus `.env` automatiquement : dotenv s'en charge ici.
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // `process.env` plutôt que `env()` : `prisma generate` (lancé par le
    // postinstall) n'a pas besoin de la base et doit passer sans `.env`.
    // Les commandes qui s'y connectent (migrate…) échouent si la variable manque.
    url: process.env.DATABASE_URL,
  },
});
