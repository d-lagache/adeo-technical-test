import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { LimitQueryDto } from './dto/limit-query.dto.js';
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
}
