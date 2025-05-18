import { defineConfig } from 'vite';
import { resolve } from 'path';

/*
Service worker cukup diletakkan di folder public karena Vite otomatis menyalinnya ke dist. 
Pendaftaran service worker sudah dilakukan manual di kode aplikasi, jadi tidak perlu konfigurasi khusus di vite.config.js.
*/

export default defineConfig({
  root: resolve(__dirname, 'src'),
  publicDir: resolve(__dirname, 'src', 'public'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
