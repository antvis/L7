import path from 'path';
import swc from 'rollup-plugin-swc';
import { defineConfig } from 'vite';
import vitePluginString from 'vite-plugin-string';

export default defineConfig({
  root: path.resolve('./__tests__'),
  server: {
    port: 8080,
    open: '/',
  },
  define: {
    global: {},
  },
  resolve: {
    alias: {
      '@antv/l7-(.+)$': '<rootDir>packages/$1',
    },
  },
  esbuild: false,
  plugins: [
    vitePluginString({
      include: [
        '**/*.vs',
        '**/*.fs',
        '**/*.vert',
        '**/*.frag',
        '**/*.glsl',
        '**/*.wgsl',
      ],
    }),
    swc({
      rollup: {
        exclude: '**/*.css',
      },
      jsc: {
        parser: {
          syntax: 'typescript',
          // tsx: true, // If you use react
          dynamicImport: true,
          decorators: true,
        },
        target: 'es2021',
        transform: {
          decoratorMetadata: true,
        },
      },
    }),
  ],
});
