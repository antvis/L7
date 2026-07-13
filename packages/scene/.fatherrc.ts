import { defineConfig } from 'father';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  extends: '../../.fatherrc.base.ts',
  // 使用 babel 编译 esm/cjs 产物，启用 transform-import-css-l7 插件完成 CSS 内联打包
  // （merged: former @antv/l7-component 的样式资源随包合并进来，需要 CSS 内联）
  esm: { transformer: 'babel' },
  cjs: isProduction ? { transformer: 'babel' } : undefined,
});
