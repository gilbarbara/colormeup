import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    include: ['test/**/*.spec.ts?(x)'],
    coverage: {
      all: true,
      include: ['src/**/*.ts?(x)'],
      exclude: ['src/main.tsx', 'src/serviceWorker.ts', 'src/types/*.ts'],
      reporter: ['text', 'lcov'],
      thresholds: {
        statements: 50,
        branches: 50,
        functions: 50,
        lines: 50,
      },
    },
    environment: 'jsdom',
    globals: true,
    setupFiles: [
      '@testing-library/react/dont-cleanup-after-each',
      './test/__setup__/vitest.setup.ts',
    ],
  },
});
