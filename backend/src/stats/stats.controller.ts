import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StatsDto } from './dto/stats.dto.js';
import { StatsService } from './stats.service.js';

@ApiTags('stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  @ApiOperation({
    summary: 'Indicateurs globaux du catalogue',
    description:
      'Nombre total de produits et d’avis, calculés en base à chaque appel.',
  })
  @ApiOkResponse({ type: StatsDto })
  getStats(): Promise<StatsDto> {
    return this.statsService.getStats();
  }
}
