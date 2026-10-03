import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    env: {
      JWT_SECRET: 'e2e-test-secret-that-is-at-least-32-characters',
      APP_TODAY: '2026-05-15',
      BASE_URL: 'http://localhost:4000',
      TRUST_CF_CONNECTING_IP: 'true',
    },
  },
});
