import { Prisma } from '../generated/prisma/client.js';
import type { PrismaService } from '../prisma/prisma.service.js';
import {
  ProductsService,
  type ProductSummaryRow,
  toProductSummaryDto,
} from './products.service.js';

const row = (
  overrides: Partial<ProductSummaryRow> = {},
): ProductSummaryRow => ({
  reference: 'REF-001',
  name: 'Perceuse',
  price: new Prisma.Decimal('49.90'),
  currency: 'EUR',
  stock: 12,
  reviewsCount: 3,
  averageNotation: new Prisma.Decimal('3.6666666666666667'),
  ...overrides,
});

describe('toProductSummaryDto', () => {
  it('convertit les Decimal en number et arrondit la moyenne à 2 décimales', () => {
    expect(toProductSummaryDto(row())).toEqual({
      reference: 'REF-001',
      name: 'Perceuse',
      price: 49.9,
      currency: 'EUR',
      stock: 12,
      reviewsCount: 3,
      averageNotation: 3.67,
    });
  });

  it('mappe un produit sans avis : 0 avis et moyenne null', () => {
    const dto = toProductSummaryDto(
      row({ reviewsCount: 0, averageNotation: null }),
    );

    expect(dto.reviewsCount).toBe(0);
    expect(dto.averageNotation).toBeNull();
  });

  it("n'expose aucun identifiant technique", () => {
    const dto = toProductSummaryDto({ ...row(), id: 42 } as ProductSummaryRow);

    expect(dto).not.toHaveProperty('id');
  });
});

describe('ProductsService.findAll', () => {
  it('renvoie les lignes SQL mappées en DTO', async () => {
    const prisma = {
      $queryRaw: vi
        .fn()
        .mockResolvedValue([
          row(),
          row({ reference: 'REF-002', reviewsCount: 0, averageNotation: null }),
        ]),
    };
    const service = new ProductsService(prisma as unknown as PrismaService);

    const products = await service.findAll();

    expect(prisma.$queryRaw).toHaveBeenCalledTimes(1);
    expect(products.map((p) => p.reference)).toEqual(['REF-001', 'REF-002']);
    expect(products[1]).toMatchObject({
      reviewsCount: 0,
      averageNotation: null,
    });
  });
});
