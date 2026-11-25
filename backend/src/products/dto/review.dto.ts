import { ApiProperty } from '@nestjs/swagger';
import { AuthorDto } from './author.dto.js';

/** Avis client sur un produit, auteur inclus. */
export class ReviewDto {
  /** Note de 1 à 5. */
  notation: number;

  /** Commentaire de l'avis. */
  comment: string;

  /** Date de l'avis (ISO 8601). */
  @ApiProperty({ format: 'date-time', example: '2023-05-14T10:32:00.000Z' })
  date: string;

  /** Auteur de l'avis. */
  author: AuthorDto;
}
