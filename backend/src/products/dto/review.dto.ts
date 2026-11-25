import { ApiProperty } from '@nestjs/swagger';
import { AuthorDto } from './author.dto.js';

/** Avis client sur un produit, auteur inclus. */
export class ReviewDto {
  /**
   * Note de 1 à 5.
   * @example 5
   */
  @ApiProperty({ minimum: 1, maximum: 5 })
  notation: number;

  /**
   * Commentaire de l'avis.
   * @example "Very practical and easy to use."
   */
  comment: string;

  /**
   * Date et heure de l'avis, ISO 8601 sans fuseau (heure locale, comme la source) :
   * à interpréter telle quelle, sans conversion de fuseau.
   * @example "2025-04-06T02:09:10"
   */
  @ApiProperty({ pattern: '^\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}$' })
  date: string;

  /** Auteur de l'avis. */
  author: AuthorDto;
}
