import type { PrismaService } from '../prisma/prisma.service.js';
import { StatsService } from './stats.service.js';

describe('StatsService', () => {
  it('renvoie le nombre de produits et le nombre d’avis', async () => {
    const prisma = {
      product: { count: vi.fn().mockResolvedValue(250) },
      review: { count: vi.fn().mockResolvedValue(766) },
    };
    const service = new StatsService(prisma as unknown as PrismaService);

    await expect(service.getStats()).resolves.toEqual({
      totalProducts: 250,
      totalReviews: 766,
    });
    expect(prisma.product.count).toHaveBeenCalledTimes(1);
    expect(prisma.review.count).toHaveBeenCalledTimes(1);
  });
});
