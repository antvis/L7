import { defineConfig } from 'father';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  extends: '../../.fatherrc.base.ts',
  // Fix: 使用 esbuild transformer 来正确处理 CSS/LESS 导入
  // esbuild 可以正确地将 .less 导入转换为内联 CSS
  esm: {
    transformer: 'esbuild',
    platform: 'browser',
  },
  cjs: isProduction
    ? {
        transformer: 'esbuild',
        platform: 'node',
      }
    : undefined,
});