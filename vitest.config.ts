import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: [
      'src/lib/**/__tests__/**/*.test.ts',
      'src/lib/**/__tests__/**/*.test.tsx',
      'src/app/**/__tests__/**/*.test.ts',
      'src/app/**/__tests__/**/*.test.tsx',
      'src/components/**/__tests__/**/*.test.ts',
      'src/components/**/__tests__/**/*.test.tsx',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/lib/utils/**'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});