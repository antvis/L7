import { container, ILayerPlugin, TYPES } from '@antv/l7-core';
import CanvasLayer from './canvas';
import CityBuildingLayer from './citybuliding/building';
import BaseLayer from './core/BaseLayer';
import BaseModel from './core/BaseModel';
import GeometryLayer from './Geometry'; // 逐步替换为 Geometry
import HeatmapLayer from './heatmap';
import ImageLayer from './image';
import LineLayer from './line/index';
import PointLayer from './point';
import PolygonLayer from './polygon';
import RasterLayer from './raster';
import TileDebugLayer from './tile/tileFactory/layers/TileDebugLayer';

import EarthLayer from './earth';

import MaskLayer from './mask';
import WindLayer from './wind';

// import ConfigSchemaValidationPlugin from './plugins/ConfigSchemaValidationPlugin';
import DataMappingPlugin from './plugins/DataMappingPlugin';
import DataSourcePlugin from './plugins/DataSourcePlugin';
import FeatureScalePlugin from './plugins/FeatureScalePlugin';
import LayerAnimateStylePlugin from './plugins/LayerAnimateStylePlugin';
import LayerMaskPlugin from './plugins/LayerMaskPlugin';
import LayerModelPlugin from './plugins/LayerModelPlugin';
import LayerStylePlugin from './plugins/LayerStylePlugin';
import LightingPlugin from './plugins/LightingPlugin';
import MultiPassRendererPlugin from './plugins/MultiPassRendererPlugin';
import PixelPickingPlugin from './plugins/PixelPickingPlugin';
import RegisterStyleAttributePlugin from './plugins/RegisterStyleAttributePlugin';
import ShaderUniformPlugin from './plugins/ShaderUniformPlugin';
import UpdateModelPlugin from './plugins/UpdateModelPlugin';
import UpdateStyleAttributePlugin from './plugins/UpdateStyleAttributePlugin';

/**
 * 校验传入参数配置项的正确性
 * @see /dev-docs/ConfigSchemaValidation.md
 */
// container
//   .bind<ILayerPlugin>(TYPES.ILayerPlugin)
//   .to(ConfigSchemaValidationPlugin)
//   .inRequestScope();
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
 * 更新地图样式配置项 如active, show, hide
 */
container
  .bind<ILayerPlugin>(TYPES.ILayerPlugin)
  .to(LayerStylePlugin)
  .inRequestScope();

/**
 * 初始化地图 Mask
 */
container
  .bind<ILayerPlugin>(TYPES.ILayerPlugin)
  .to(LayerMaskPlugin)
  .inRequestScope();

/**
 * 负责属性更新
 */
container
  .bind<ILayerPlugin>(TYPES.ILayerPlugin)
  .to(UpdateStyleAttributePlugin)
  .inRequestScope();

/**
 * 负责Model更新
 */
container
  .bind<ILayerPlugin>(TYPES.ILayerPlugin)
  .to(UpdateModelPlugin)
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
 * 传入动画参数
 */
container
  .bind<ILayerPlugin>(TYPES.ILayerPlugin)
  .to(LayerAnimateStylePlugin)
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
/**
 * 初始化Model
 */
container
  .bind<ILayerPlugin>(TYPES.ILayerPlugin)
  .to(LayerModelPlugin)
  .inRequestScope();

export * from './core/interface';
export {
  BaseLayer,
  BaseModel,
  PointLayer,
  PolygonLayer,
  LineLayer,
  CityBuildingLayer,
  GeometryLayer,
  CanvasLayer,
  ImageLayer,
  RasterLayer,
  HeatmapLayer,
  EarthLayer,
  WindLayer,
  MaskLayer,
  TileDebugLayer,
};
