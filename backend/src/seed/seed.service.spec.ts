import { Logger } from '@nestjs/common';
import type { PrismaService } from '../prisma/prisma.service.js';
import { SeedService } from './seed.service.js';

function createPrismaMock(productCount: number) {
  let nextId = 1;
  const withIds = ({ data }: { data: object[] }) =>
    Promise.resolve(data.map((row) => ({ id: nextId++, ...row })));

  const tx = {
    author: { createManyAndReturn: vi.fn(withIds) },
    product: { createManyAndReturn: vi.fn(withIds) },
    review: {
      createMany: vi.fn(({ data }: { data: object[] }) =>
        Promise.resolve({ count: data.length }),
      ),
    },
  };
  const prisma = {
    product: { count: vi.fn().mockResolvedValue(productCount) },
    $transaction: vi.fn((fn: (client: typeof tx) => Promise<unknown>) =>
      fn(tx),
    ),
  };

  return { prisma, tx };
}

describe('SeedService', () => {
  let log: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    log = vi.spyOn(Logger.prototype, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("n'insère rien si la base contient déjà des produits", async () => {
    const { prisma, tx } = createPrismaMock(250);
    const service = new SeedService(prisma as unknown as PrismaService);

    await service.onApplicationBootstrap();

    expect(prisma.$transaction).not.toHaveBeenCalled();
    expect(tx.product.createManyAndReturn).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith(expect.stringContaining('déjà remplie'));
  });

  it('insère tout le catalogue dans une transaction si la base est vide', async () => {
    const { prisma, tx } = createPrismaMock(0);
    const service = new SeedService(prisma as unknown as PrismaService);

    await service.onApplicationBootstrap();

    expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    expect(tx.author.createManyAndReturn.mock.calls[0][0].data).toHaveLength(
      766,
    );
    expect(tx.product.createManyAndReturn.mock.calls[0][0].data).toHaveLength(
      250,
    );

    const reviews = tx.review.createMany.mock.calls[0][0].data as {
      productId: number;
      authorId: number;
    }[];
    expect(reviews).toHaveLength(766);
    expect(
      reviews.every(
        (r) => Number.isInteger(r.productId) && Number.isInteger(r.authorId),
      ),
    ).toBe(true);
    expect(log).toHaveBeenCalledWith(
      'Seed terminé : 250 produits, 766 avis, 766 auteurs insérés',
    );
  });
});
