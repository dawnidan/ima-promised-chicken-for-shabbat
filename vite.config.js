import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/ima-promised-chicken-for-shabbat/',
  server: {
    proxy: {
      '/api': 'http://localhost:8787',
    },
  },
});
