import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
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
}
