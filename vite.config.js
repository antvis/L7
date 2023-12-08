import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  root: path.resolve('./__tests__'),
  server: {
    port: 8080,
    open: '/',
  },
  define: {
    global: {},
  },
});
