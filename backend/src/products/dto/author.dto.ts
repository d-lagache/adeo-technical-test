import { ApiProperty } from '@nestjs/swagger';
import { AuthorType } from '../../generated/prisma/enums.js';

/** Auteur d'un avis (aucun identifiant exposé). */
export class AuthorDto {
  /** Prénom de l'auteur. */
  firstName: string;

  /** Nom de l'auteur. */
  lastName: string;

  /** Profil de l'auteur. */
  @ApiProperty({ enum: AuthorType, enumName: 'AuthorType' })
  type: AuthorType;
}
