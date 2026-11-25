import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { StatsDto } from './dto/stats.dto.js';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Comptages faits en SQL (`COUNT(*)`), lancés en parallèle. */
  async getStats(): Promise<StatsDto> {
    const [totalProducts, totalReviews] = await Promise.all([
      this.prisma.product.count(),
      this.prisma.review.count(),
    ]);
    return { totalProducts, totalReviews };
  }
}
