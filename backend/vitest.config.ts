import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: './',
    include: ['src/**/*.spec.ts'],
    passWithNoTests: true,
    // Les décorateurs Nest / class-validator lisent les métadonnées via Reflect.
    setupFiles: ['reflect-metadata'],
  },
});
