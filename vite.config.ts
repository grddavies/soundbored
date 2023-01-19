import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/soundbored/', // GH-pages location
  plugins: [solidPlugin()],
});
