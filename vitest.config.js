import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vue()],
  test: {
    coverage: {
      exclude: ['src/index.ts'],
      include: ['src/**/*.{js,ts,vue}'],
      provider: 'v8',
      reporter: ['text', 'text-summary'],
    },
    environment: 'happy-dom',
  },
});
