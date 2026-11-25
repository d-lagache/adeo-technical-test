import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  authorKey,
  mapSourceToSeedData,
  parseSourceDate,
} from './seed.mapper.js';
import type { SourceProduct, SourceReview } from './source.types.js';

function product(
  reference: string,
  reviews: SourceReview[] = [],
): SourceProduct {
  return {
    reference,
    name: `Produit ${reference}`,
    description: 'Description',
    price: 12.5,
    currency: 'EUR',
    stock: 3,
    reviews,
  };
}

function review(
  firstName: string,
  lastName: string,
  type: 'amateur' | 'professional' = 'amateur',
  notation = 4,
): SourceReview {
  return {
    notation,
    date: '2025-04-06T02:09:10',
    comment: 'Commentaire',
    author: { firstName, lastName, type },
  };
}

describe('mapSourceToSeedData', () => {
  it('dédoublonne deux auteurs identiques, même sur des produits différents', () => {
    const data = mapSourceToSeedData([
      product('A', [review('Jean', 'Dupont')]),
      product('B', [review('Jean', 'Dupont')]),
    ]);

    expect(data.authors).toEqual([
      { firstName: 'Jean', lastName: 'Dupont', type: 'amateur' },
    ]);
    expect(data.reviews).toHaveLength(2);
    expect(data.reviews[0].authorKey).toBe(data.reviews[1].authorKey);
  });

  it('distingue deux auteurs homonymes de types différents', () => {
    const data = mapSourceToSeedData([
      product('A', [
        review('Jean', 'Dupont', 'amateur'),
        review('Jean', 'Dupont', 'professional'),
      ]),
    ]);

    expect(data.authors).toHaveLength(2);
  });

  it('garde un produit sans avis', () => {
    const data = mapSourceToSeedData([product('A')]);

    expect(data.products).toEqual([
      {
        reference: 'A',
        name: 'Produit A',
        description: 'Description',
        price: 12.5,
        currency: 'EUR',
        stock: 3,
      },
    ]);
    expect(data.authors).toEqual([]);
    expect(data.reviews).toEqual([]);
  });

  it('relie chaque avis à son produit et à son auteur', () => {
    const data = mapSourceToSeedData([
      product('A', [review('Jean', 'Dupont', 'professional', 2)]),
    ]);

    expect(data.reviews).toEqual([
      {
        productReference: 'A',
        authorKey: authorKey({
          firstName: 'Jean',
          lastName: 'Dupont',
          type: 'professional',
        }),
        notation: 2,
        comment: 'Commentaire',
        reviewedAt: new Date('2025-04-06T02:09:10.000Z'),
      },
    ]);
  });

  it('produit 250 produits, 766 avis et 766 auteurs à partir de data/products.json', () => {
    const path = resolve(import.meta.dirname, '../../../data/products.json');
    const source = JSON.parse(readFileSync(path, 'utf8')) as SourceProduct[];

    const data = mapSourceToSeedData(source);

    expect(data.products).toHaveLength(250);
    expect(data.reviews).toHaveLength(766);
    expect(data.authors).toHaveLength(766);
  });
});

describe('parseSourceDate', () => {
  it('lit la date sans fuseau en UTC, sans décalage', () => {
    expect(parseSourceDate('2025-04-06T02:09:10').toISOString()).toBe(
      '2025-04-06T02:09:10.000Z',
    );
  });

  it('rejette une date invalide', () => {
    expect(() => parseSourceDate('pas une date')).toThrow(/invalide/);
  });
});
