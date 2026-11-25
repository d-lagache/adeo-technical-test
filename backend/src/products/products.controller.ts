import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ApiErrorDto } from '../common/dto/api-error.dto.js';
import { LimitQueryDto } from './dto/limit-query.dto.js';
import { ReviewDto } from './dto/review.dto.js';
import { ProductDetailDto } from './dto/product-detail.dto.js';
import { MostAppreciatedProductDto } from './dto/most-appreciated-product.dto.js';
import { ProductSummaryDto } from './dto/product-summary.dto.js';
import { ProductsService } from './products.service.js';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({
    summary: 'Catalogue complet, en version résumée',
    description:
      'Tous les produits, sans description ni avis, triés par référence. Pas de pagination (250 produits). Le détail est sur `/products/{reference}`, les avis sur `/products/{reference}/reviews`.',
  })
  @ApiOkResponse({ type: [ProductSummaryDto] })
  findAll(): Promise<ProductSummaryDto[]> {
    return this.productsService.findAll();
  }

  // Les classements sont déclarés avant `:reference`, sinon « most-appreciated »
  // serait capturé comme une référence.
  @Get('most-appreciated')
  @ApiOperation({
    summary: "Produits ayant le plus d'avis positifs",
    description:
      'Avis positif = note strictement supérieure à 3 (`notation > 3`). Les produits sans avis positif sont exclus. Tri par nombre d’avis positifs décroissant, puis par référence. `limit` : 5 par défaut, entre 1 et 50.',
  })
  @ApiOkResponse({ type: [MostAppreciatedProductDto] })
  @ApiBadRequestResponse({
    description: '`limit` hors de [1, 50] ou non entier',
    type: ApiErrorDto,
    example: {
      statusCode: 400,
      message: ['limit must not be greater than 50'],
      error: 'Bad Request',
    },
  })
  findMostAppreciated(
    @Query() { limit }: LimitQueryDto,
  ): Promise<MostAppreciatedProductDto[]> {
    return this.productsService.findMostAppreciated(limit);
  }

  @Get('lowest-rated')
  @ApiOperation({
    summary: 'Produits les moins bien notés',
    description:
      'Produits dont la note moyenne est strictement inférieure à 3 (`averageNotation < 3`), triés par moyenne croissante puis par référence. Les produits sans avis sont exclus. `limit` : 5 par défaut, entre 1 et 50.',
  })
  @ApiOkResponse({ type: [ProductSummaryDto] })
  @ApiBadRequestResponse({
    description: '`limit` hors de [1, 50] ou non entier',
    type: ApiErrorDto,
    example: {
      statusCode: 400,
      message: ['limit must not be greater than 50'],
      error: 'Bad Request',
    },
  })
  findLowestRated(
    @Query() { limit }: LimitQueryDto,
  ): Promise<ProductSummaryDto[]> {
    return this.productsService.findLowestRated(limit);
  }

  @Get(':reference')
  @ApiOperation({
    summary: "Détail d'un produit, sans ses avis",
    description:
      'Résumé du produit complété de sa description. Les avis sont exposés à part, sur `/products/{reference}/reviews`.',
  })
  @ApiParam({
    name: 'reference',
    description: 'Référence du produit',
    example: '59033201',
  })
  @ApiOkResponse({ type: ProductDetailDto })
  @ApiNotFoundResponse({
    description: 'Aucun produit avec cette référence',
    type: ApiErrorDto,
  })
  findOne(@Param('reference') reference: string): Promise<ProductDetailDto> {
    return this.productsService.findOne(reference);
  }

  @Get(':reference/reviews')
  @ApiOperation({
    summary: "Avis d'un produit, auteur inclus",
    description:
      'Avis triés du plus récent au plus ancien, chacun avec son auteur (prénom, nom, profil). Tableau vide si le produit existe sans avis ; 404 s’il n’existe pas.',
  })
  @ApiParam({
    name: 'reference',
    description: 'Référence du produit',
    example: '59033201',
  })
  @ApiOkResponse({ type: [ReviewDto] })
  @ApiNotFoundResponse({
    description: 'Aucun produit avec cette référence',
    type: ApiErrorDto,
  })
  findReviews(@Param('reference') reference: string): Promise<ReviewDto[]> {
    return this.productsService.findReviews(reference);
  }
}
