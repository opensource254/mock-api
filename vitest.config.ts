import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // Optional: to use Vitest globals without importing
    environment: 'node', // Specify Node.js environment for backend tests
    coverage: {
      provider: 'v8', // or 'istanbul'
      reporter: ['text', 'json', 'html'],
    },
    include: ['src/tests/**/*.test.ts'], // Pattern to find test files
  },
});
