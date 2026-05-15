import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';
import { VitePWA } from 'vite-plugin-pwa';
import solidPlugin from 'vite-plugin-solid';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/soundbored/', // GH-pages location
  plugins: [
    solidPlugin(),
    tsconfigPaths(),
    checker({ typescript: true }),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'SoundBored',
        short_name: 'SoundBored',
        description: 'A web-based soundboard app',
        theme_color: '#da571a',
        background_color: '#1d1e27',
        display: 'standalone',
        orientation: 'any',
        scope: '/soundbored/',
        start_url: '/soundbored/',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  define: { 'process.env': {} },
});
