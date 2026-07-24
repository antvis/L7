import DataMappingPlugin from './DataMappingPlugin';
import DataSourcePlugin from './DataSourcePlugin';
import FeatureScalePlugin from './FeatureScalePlugin';
import LayerAnimateStylePlugin from './LayerAnimateStylePlugin';
import LayerMaskPlugin from './LayerMaskPlugin';
import LayerModelPlugin from './LayerModelPlugin';
import LayerStylePlugin from './LayerStylePlugin';
import LightingPlugin from './LightingPlugin';
import MultiPassRendererPlugin from './MultiPassRendererPlugin';
import PixelPickingPlugin from './PixelPickingPlugin';
import RegisterStyleAttributePlugin from './RegisterStyleAttributePlugin';
import ShaderUniformPlugin from './ShaderUniformPlugin';
import UpdateModelPlugin from './UpdateModelPlugin';
import UpdateStyleAttributePlugin from './UpdateStyleAttributePlugin';
import { LayerPluginRegistry } from './registry';

// 默认插件实例化逻辑已迁入 `LayerPluginRegistry.registerBuiltinDefaults`
// （阶段 2.1）。保留以下各插件具名 re-export 供外部按需 import。
export {
  DataMappingPlugin,
  DataSourcePlugin,
  FeatureScalePlugin,
  LayerAnimateStylePlugin,
  LayerMaskPlugin,
  LayerModelPlugin,
  LayerStylePlugin,
  LightingPlugin,
  MultiPassRendererPlugin,
  PixelPickingPlugin,
  RegisterStyleAttributePlugin,
  ShaderUniformPlugin,
  UpdateModelPlugin,
  UpdateStyleAttributePlugin,
};

/**
 * @deprecated 阶段 2.1：默认插件集来源迁入 `LayerPluginRegistry`。
 *
 * 本函数保留为 deprecation wrapper，行为与迁移前字节级等价（返回 14 个全新
 * 插件实例，顺序不变）。新代码应使用 `new LayerPluginRegistry()` +
 * `registerBuiltinDefaults()` + `getAll()`，或在 `BaseLayer` 上直接配置
 * `pluginRegistry` 字段（init 前自定义追加/重排）。
 *
 * 内部实现：`new LayerPluginRegistry().registerBuiltinDefaults().getAll()`。
 */
export function createPlugins() {
  return new LayerPluginRegistry().registerBuiltinDefaults().getAll();
}
