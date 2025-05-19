import { defineConfig } from 'vite';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';

/*
Service worker cukup diletakkan di folder public karena Vite otomatis menyalinnya ke dist. 
Pendaftaran service worker sudah dilakukan manual di kode aplikasi, jadi tidak perlu konfigurasi khusus di vite.config.js.
*/

export default defineConfig({
  root: resolve(__dirname, 'src'),
  base: '/My-Story-App/',
  publicDir: resolve(__dirname, 'src', 'public'),
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'src/index.html'),
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: '.',
      filename: 'sw.js',
      devOptions: {
        enabled: true,
        type: 'module'
      },
    }),
  ],
});
