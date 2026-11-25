import { defineConfig } from 'vitest/config';

export default defineConfig({
  // Resolves the path aliases declared in tsconfig.json, including the ones
  // added by `nest g library`. Requires Vite 8, which ships this option.
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['src/**/*.spec.ts'],
    passWithNoTests: true,
    // Les décorateurs Nest / class-validator lisent les métadonnées via Reflect.
    setupFiles: ['reflect-metadata'],
  },
});
