import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
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
    description: 'Trié par référence. Pas de pagination (250 produits).',
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
      'Avis positif = note strictement supérieure à 3. Tri par nombre d’avis positifs décroissant, puis par référence.',
  })
  @ApiOkResponse({ type: [MostAppreciatedProductDto] })
  @ApiBadRequestResponse({
    description: '`limit` hors de [1, 50] ou non entier',
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
      'Produits dont la note moyenne est strictement inférieure à 3, triés par moyenne croissante puis par référence. Les produits sans avis sont exclus.',
  })
  @ApiOkResponse({ type: [ProductSummaryDto] })
  @ApiBadRequestResponse({
    description: '`limit` hors de [1, 50] ou non entier',
  })
  findLowestRated(
    @Query() { limit }: LimitQueryDto,
  ): Promise<ProductSummaryDto[]> {
    return this.productsService.findLowestRated(limit);
  }

  @Get(':reference')
  @ApiOperation({ summary: "Détail d'un produit, sans ses avis" })
  @ApiParam({
    name: 'reference',
    description: 'Référence du produit',
    example: '59033201',
  })
  @ApiOkResponse({ type: ProductDetailDto })
  @ApiNotFoundResponse({ description: 'Référence inconnue' })
  findOne(@Param('reference') reference: string): Promise<ProductDetailDto> {
    return this.productsService.findOne(reference);
  }

  @Get(':reference/reviews')
  @ApiOperation({
    summary: "Avis d'un produit, auteur inclus",
    description:
      'Triés du plus récent au plus ancien. Tableau vide si le produit n’a aucun avis.',
  })
  @ApiParam({
    name: 'reference',
    description: 'Référence du produit',
    example: '59033201',
  })
  @ApiOkResponse({ type: [ReviewDto] })
  @ApiNotFoundResponse({ description: 'Référence inconnue' })
  findReviews(@Param('reference') reference: string): Promise<ReviewDto[]> {
    return this.productsService.findReviews(reference);
  }
}
