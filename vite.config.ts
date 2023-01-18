import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/react-soundboard/', // GH-pages location
  plugins: [solidPlugin()],
});
