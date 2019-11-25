import { container, ILayerPlugin, TYPES } from '@antv/l7-core';
import BaseLayer from './core/BaseLayer';
import './glsl.d';
import HeatmapLayer from './heatmap';
import DashLineLayer from './line/dash';
import LineLayer from './line/index';
import PointLayer from './point';
import PolygonLayer from './polygon';
import ImageLayer from './raster/image';
import RasterLayer from './raster/raster';

import ConfigSchemaValidationPlugin from './plugins/ConfigSchemaValidationPlugin';
import DataMappingPlugin from './plugins/DataMappingPlugin';
import DataSourcePlugin from './plugins/DataSourcePlugin';
import FeatureScalePlugin from './plugins/FeatureScalePlugin';
import LightingPlugin from './plugins/LightingPlugin';
import MultiPassRendererPlugin from './plugins/MultiPassRendererPlugin';
import PixelPickingPlugin from './plugins/PixelPickingPlugin';
import RegisterStyleAttributePlugin from './plugins/RegisterStyleAttributePlugin';
import ShaderUniformPlugin from './plugins/ShaderUniformPlugin';
import UpdateStyleAttributePlugin from './plugins/UpdateStyleAttributePlugin';

/**
 * 校验传入参数配置项的正确性
 * @see /dev-docs/ConfigSchemaValidation.md
 */
container
  .bind<ILayerPlugin>(TYPES.ILayerPlugin)
  .to(ConfigSchemaValidationPlugin)
  .inRequestScope();
/**
 * 获取 Source
 */
container
  .bind<ILayerPlugin>(TYPES.ILayerPlugin)
  .to(DataSourcePlugin)
  .inRequestScope();
/**
 * 根据 StyleAttribute 创建 VertexAttribute
 */
container
  .bind<ILayerPlugin>(TYPES.ILayerPlugin)
  .to(RegisterStyleAttributePlugin)
  .inRequestScope();
/**
 * 根据 Source 创建 Scale
 */
container
  .bind<ILayerPlugin>(TYPES.ILayerPlugin)
  .to(FeatureScalePlugin)
  .inRequestScope();
/**
 * 使用 Scale 进行数据映射
 */
container
  .bind<ILayerPlugin>(TYPES.ILayerPlugin)
  .to(DataMappingPlugin)
  .inRequestScope();
/**
 * 负责属性更新
 */
container
  .bind<ILayerPlugin>(TYPES.ILayerPlugin)
  .to(UpdateStyleAttributePlugin)
  .inRequestScope();
/**
 * Multi Pass 自定义渲染管线
 */
container
  .bind<ILayerPlugin>(TYPES.ILayerPlugin)
  .to(MultiPassRendererPlugin)
  .inRequestScope();
/**
 * 传入相机坐标系参数
 */
container
  .bind<ILayerPlugin>(TYPES.ILayerPlugin)
  .to(ShaderUniformPlugin)
  .inRequestScope();
/**
 * 传入光照相关参数
 */
container
  .bind<ILayerPlugin>(TYPES.ILayerPlugin)
  .to(LightingPlugin)
  .inRequestScope();
/**
 * 负责拾取过程中 Encode 以及 Highlight 阶段及结束后恢复
 */
container
  .bind<ILayerPlugin>(TYPES.ILayerPlugin)
  .to(PixelPickingPlugin)
  .inRequestScope();

export {
  BaseLayer,
  PointLayer,
  PolygonLayer,
  LineLayer,
  DashLineLayer,
  ImageLayer,
  RasterLayer,
  HeatmapLayer,
};
