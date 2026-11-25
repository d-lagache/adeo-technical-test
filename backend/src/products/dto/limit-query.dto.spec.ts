import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { LimitQueryDto } from './limit-query.dto.js';

const parse = (query: Record<string, unknown>) => {
  const dto = plainToInstance(LimitQueryDto, query);
  return { dto, errors: validateSync(dto) };
};

describe('LimitQueryDto', () => {
  it('vaut 5 par défaut', () => {
    const { dto, errors } = parse({});

    expect(errors).toHaveLength(0);
    expect(dto.limit).toBe(5);
  });

  it('convertit une chaîne numérique en entier', () => {
    const { dto, errors } = parse({ limit: '10' });

    expect(errors).toHaveLength(0);
    expect(dto.limit).toBe(10);
  });

  it.each(['1', '50'])('accepte la borne %s', (limit) => {
    expect(parse({ limit }).errors).toHaveLength(0);
  });

  it.each(['0', '51', 'abc', '2.5'])('rejette limit=%s', (limit) => {
    expect(parse({ limit }).errors).not.toHaveLength(0);
  });
});
