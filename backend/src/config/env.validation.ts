import { plainToInstance } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  validateSync,
} from 'class-validator';

/** Variables d'environnement attendues par l'API (voir `.env.example`). */
export class EnvironmentVariables {
  @IsUrl({ protocols: ['postgres', 'postgresql'], require_tld: false })
  @IsNotEmpty()
  DATABASE_URL!: string;

  @IsInt()
  @Min(1)
  @Max(65535)
  @IsOptional()
  PORT: number = 3000;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  CORS_ORIGIN: string = 'http://localhost:5173';
}

/**
 * Valide et normalise l'environnement au démarrage (`ConfigModule.forRoot({ validate })`).
 * Lève une erreur explicite si une variable est absente ou invalide : l'API refuse alors de démarrer.
 */
export function validate(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const env = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
    exposeDefaultValues: true,
  });
  const errors = validateSync(env, { skipMissingProperties: false });

  if (errors.length > 0) {
    const details = errors
      .flatMap((error) => Object.values(error.constraints ?? {}))
      .map((message) => `  - ${message}`)
      .join('\n');
    throw new Error(`Configuration d'environnement invalide :\n${details}`);
  }

  return env;
}
