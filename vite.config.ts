import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import copy from 'vite-plugin-cp';
import vitePluginString from 'vite-plugin-string';

export default defineConfig({
  root: './examples/',
  server: { port: 8080, open: '/' },
  base: './',
  resolve: {
    alias: {
      '@antv/l7': path.resolve(__dirname, './packages/l7/src'),
      '@antv/l7-maps': path.resolve(__dirname, './packages/maps/src'),
      '@antv/l7-core': path.resolve(__dirname, './packages/core/src'),
      '@antv/l7-component': path.resolve(__dirname, './packages/component/src'),
      '@antv/l7-three': path.resolve(__dirname, './packages/three/src'),
      '@antv/l7-layers': path.resolve(__dirname, './packages/layers/src'),
      '@antv/l7-map': path.resolve(__dirname, './packages/map/src'),
      '@antv/l7-renderer': path.resolve(__dirname, './packages/renderer/src'),
      '@antv/l7-scene': path.resolve(__dirname, './packages/scene/src'),
      '@antv/l7-source': path.resolve(__dirname, './packages/source/src'),
      '@antv/l7-utils': path.resolve(__dirname, './packages/utils/src'),
    },
  },
  plugins: [
    react(),
    vitePluginString({
      compress: false,
    }),
    copy({
      targets: [
        {
          src: './node_modules/@antv/g-device-api/dist/pkg/glsl_wgsl_compiler_bg.wasm',
          dest: 'examples/public',
        },
      ],
      hook: 'buildStart',
    }),
  ],
  esbuild: {},
  define: {
    'process.env.VERSION': JSON.stringify('1.0.0'),
    global: {},
  },
});
