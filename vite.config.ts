import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import postcssNesting from 'postcss-nesting';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});
