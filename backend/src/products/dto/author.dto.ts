import { ApiProperty } from '@nestjs/swagger';
import { AuthorType } from '../../generated/prisma/enums.js';

/** Auteur d'un avis (aucun identifiant exposé). */
export class AuthorDto {
  /**
   * Prénom de l'auteur.
   * @example Poha
   */
  firstName: string;

  /**
   * Nom de l'auteur.
   * @example Kuxero
   */
  lastName: string;

  /** Profil de l'auteur. */
  @ApiProperty({
    enum: AuthorType,
    enumName: 'AuthorType',
    example: AuthorType.professional,
  })
  type: AuthorType;
}
