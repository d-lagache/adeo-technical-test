import { NotFoundException } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import type { PrismaService } from '../prisma/prisma.service.js';
import {
  ProductsService,
  type ProductSummaryRow,
  toMostAppreciatedProductDto,
  toProductSummaryDto,
} from './products.service.js';

/** Requête SQL (texte paramétré + valeurs) passée au premier appel de `$queryRaw`. */
const sqlOf = (queryRaw: ReturnType<typeof vi.fn>): Prisma.Sql =>
  queryRaw.mock.calls[0][0] as Prisma.Sql;

/** Texte SQL sur une ligne, pour des assertions insensibles à l'indentation. */
const flat = (sql: Prisma.Sql) => sql.text.replace(/\s+/g, ' ');

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

describe('ProductsService.findMostAppreciated', () => {
  const setup = (rows: unknown[] = []) => {
    const prisma = { $queryRaw: vi.fn().mockResolvedValue(rows) };
    return {
      prisma,
      service: new ProductsService(prisma as unknown as PrismaService),
    };
  };

  it('ne compte comme positifs que les avis de note strictement supérieure à 3', async () => {
    const { prisma, service } = setup();

    await service.findMostAppreciated(5);

    const sql = flat(sqlOf(prisma.$queryRaw));
    expect(sql).toContain('FILTER (WHERE r.notation > 3)');
    expect(sql).not.toContain('>= 3');
  });

  it('trie par avis positifs décroissants puis par référence, et applique la limite', async () => {
    const { prisma, service } = setup();

    await service.findMostAppreciated(7);

    const sql = sqlOf(prisma.$queryRaw);
    expect(flat(sql)).toContain(
      'ORDER BY "positiveReviewsCount" DESC, p.reference LIMIT $1',
    );
    expect(sql.values).toEqual([7]);
  });

  it('mappe positiveReviewsCount en plus du résumé', async () => {
    const { service } = setup([{ ...row(), positiveReviewsCount: 2 }]);

    const [product] = await service.findMostAppreciated(5);

    expect(product).toMatchObject(toProductSummaryDto(row()));
    expect(product.positiveReviewsCount).toBe(2);
  });
});

describe('toMostAppreciatedProductDto', () => {
  it("n'expose aucun identifiant technique", () => {
    const dto = toMostAppreciatedProductDto({
      ...row(),
      positiveReviewsCount: 1,
      id: 42,
    } as Parameters<typeof toMostAppreciatedProductDto>[0]);

    expect(dto).not.toHaveProperty('id');
  });
});

describe('ProductsService.findLowestRated', () => {
  const setup = (rows: unknown[] = []) => {
    const prisma = { $queryRaw: vi.fn().mockResolvedValue(rows) };
    return {
      prisma,
      service: new ProductsService(prisma as unknown as PrismaService),
    };
  };

  it('exclut les produits de moyenne exactement 3 (comparaison stricte)', async () => {
    const { prisma, service } = setup();

    await service.findLowestRated(5);

    const sql = flat(sqlOf(prisma.$queryRaw));
    expect(sql).toContain('HAVING AVG(r.notation) < 3');
    expect(sql).not.toContain('<= 3');
  });

  it('exclut les produits sans avis (jointure interne)', async () => {
    const { prisma, service } = setup();

    await service.findLowestRated(5);

    const sql = flat(sqlOf(prisma.$queryRaw));
    expect(sql).toContain('INNER JOIN reviews r');
    expect(sql).not.toContain('LEFT JOIN');
  });

  it('trie par moyenne croissante puis par référence, et applique la limite', async () => {
    const { prisma, service } = setup();

    await service.findLowestRated(3);

    const sql = sqlOf(prisma.$queryRaw);
    expect(flat(sql)).toContain(
      'ORDER BY AVG(r.notation) ASC, p.reference LIMIT $1',
    );
    expect(sql.values).toEqual([3]);
  });

  it('mappe les lignes en résumés produit', async () => {
    const { service } = setup([
      row({ averageNotation: new Prisma.Decimal('1.5') }),
    ]);

    const [product] = await service.findLowestRated(5);

    expect(product.averageNotation).toBe(1.5);
  });
});

describe('ProductsService.findOne', () => {
  const setup = (rows: unknown[]) => {
    const prisma = { $queryRaw: vi.fn().mockResolvedValue(rows) };
    return {
      prisma,
      service: new ProductsService(prisma as unknown as PrismaService),
    };
  };

  it('renvoie le résumé et la description du produit demandé', async () => {
    const { prisma, service } = setup([
      { ...row(), description: 'Perceuse sans fil' },
    ]);

    const product = await service.findOne('REF-001');

    expect(product).toMatchObject(toProductSummaryDto(row()));
    expect(product.description).toBe('Perceuse sans fil');
    expect(product).not.toHaveProperty('reviews');
    expect(sqlOf(prisma.$queryRaw).values).toEqual(['REF-001']);
  });

  it('lève une 404 si la référence est inconnue', async () => {
    const { service } = setup([]);

    await expect(service.findOne('inconnu')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});

describe('ProductsService.findReviews', () => {
  const review = {
    notation: 4,
    comment: 'Très bien',
    reviewedAt: new Date('2023-05-14T10:32:00.000Z'),
    author: { firstName: 'Ada', lastName: 'Lovelace', type: 'professional' },
  };
  const setup = (product: unknown) => {
    const prisma = {
      product: { findUnique: vi.fn().mockResolvedValue(product) },
    };
    return {
      prisma,
      service: new ProductsService(prisma as unknown as PrismaService),
    };
  };

  it('renvoie les avis avec leur auteur, sans identifiant, du plus récent au plus ancien', async () => {
    const { prisma, service } = setup({
      reviews: [{ ...review, id: 1, author: { ...review.author, id: 9 } }],
    });

    const reviews = await service.findReviews('REF-001');

    expect(reviews).toEqual([
      {
        notation: 4,
        comment: 'Très bien',
        date: '2023-05-14T10:32:00.000Z',
        author: {
          firstName: 'Ada',
          lastName: 'Lovelace',
          type: 'professional',
        },
      },
    ]);
    expect(prisma.product.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { reference: 'REF-001' },
        select: {
          reviews: expect.objectContaining({
            orderBy: { reviewedAt: 'desc' },
          }) as unknown,
        },
      }),
    );
  });

  it('renvoie un tableau vide si le produit existe sans avis', async () => {
    const { service } = setup({ reviews: [] });

    await expect(service.findReviews('REF-001')).resolves.toEqual([]);
  });

  it('lève une 404 si le produit est inconnu', async () => {
    const { service } = setup(null);

    await expect(service.findReviews('inconnu')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
