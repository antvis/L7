## 说明

L7 官网站点源码

图表示例的公共环境由 `astro.config.mjs` 中的 `demo.setup` 配置接入。`src/demo/setup.ts` 在示例执行前创建地图容器、加载样式和高德 SDK，并注册 Three.js 模型加载器；示例文件只保留自身逻辑，无需逐个导入公共初始化。与原官网一致，高德 SDK 通过 `window.AMap` 提供全局 API，模型加载器通过 `window.GLTFLoader` 提供，marker 的 `.labelclass` 样式统一放在 `src/demo/map.css`；示例源码不再导入这些站点环境文件。

主题负责初次预览、编辑后运行和导出项目的初始化顺序。公共初始化文件不在源码面板中展示，仍包含在 Markdown 和 StackBlitz 导出中。文档内工具示例使用自身布局，公共初始化通过源码路径跳过这类页面。
