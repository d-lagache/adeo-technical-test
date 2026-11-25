import { validate } from './env.validation.js';

const DATABASE_URL = 'postgresql://adeo:adeo@localhost:5432/adeo';

describe('validate (environnement)', () => {
  it('applique les valeurs par défaut de PORT et CORS_ORIGIN', () => {
    const env = validate({ DATABASE_URL });

    expect(env.DATABASE_URL).toBe(DATABASE_URL);
    expect(env.PORT).toBe(3000);
    expect(env.CORS_ORIGIN).toBe('http://localhost:5173');
  });

  it('convertit PORT en entier', () => {
    expect(validate({ DATABASE_URL, PORT: '4000' }).PORT).toBe(4000);
  });

  it('refuse un environnement sans DATABASE_URL', () => {
    expect(() => validate({})).toThrow(/DATABASE_URL/);
  });

  it('refuse une DATABASE_URL qui n’est pas une URL PostgreSQL', () => {
    expect(() => validate({ DATABASE_URL: 'mysql://localhost/adeo' })).toThrow(
      /DATABASE_URL/,
    );
  });

  it('refuse un PORT non entier', () => {
    expect(() => validate({ DATABASE_URL, PORT: 'abc' })).toThrow(/PORT/);
  });
});
