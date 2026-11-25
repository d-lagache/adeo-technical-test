import { ApiProperty } from '@nestjs/swagger';

/**
 * Corps d'erreur renvoyé par NestJS (format par défaut, non personnalisé).
 * Sert uniquement à documenter les réponses 400 et 404 dans Swagger.
 */
export class ApiErrorDto {
  /**
   * Code HTTP de l'erreur.
   * @example 404
   */
  statusCode: number;

  /** Message d'erreur ; liste des contraintes violées pour une erreur de validation (400). */
  @ApiProperty({
    oneOf: [{ type: 'string' }, { type: 'array', items: { type: 'string' } }],
    example: 'Produit 00000000 introuvable',
  })
  message: string | string[];

  /**
   * Libellé du statut HTTP.
   * @example "Not Found"
   */
  error: string;
}
