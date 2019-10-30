import { container, ILayerPlugin, TYPES } from '@l7/core';
import BaseLayer from './core/BaseLayer';
import HeatMapGridLayer from './heatmap/grid';
import ArcLineLayer from './line/arc';
import Arc2DLineLayer from './line/arc2d';
import LineLayer from './line/index';
import Point3dLayer from './point/extrude';
import PointImageLayer from './point/image';
import PointLayer from './point/index';
// import Point from './point/point';
import PolygonLayer from './polygon';
import Polygon3DLayer from './polygon/polygon3D';
import ImageLayer from './raster/image';

import ConfigSchemaValidationPlugin from './plugins/ConfigSchemaValidationPlugin';
import DataMappingPlugin from './plugins/DataMappingPlugin';
import DataSourcePlugin from './plugins/DataSourcePlugin';
import FeatureScalePlugin from './plugins/FeatureScalePlugin';
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
  .to(ConfigSchemaValidationPlugin);
/**
 * 获取 Source
 */
container.bind<ILayerPlugin>(TYPES.ILayerPlugin).to(DataSourcePlugin);
/**
 * 根据 StyleAttribute 创建 VertexAttribute
 */
container
  .bind<ILayerPlugin>(TYPES.ILayerPlugin)
  .to(RegisterStyleAttributePlugin);
/**
 * 根据 Source 创建 Scale
 */
container.bind<ILayerPlugin>(TYPES.ILayerPlugin).to(FeatureScalePlugin);
/**
 * 使用 Scale 进行数据映射
 */
container.bind<ILayerPlugin>(TYPES.ILayerPlugin).to(DataMappingPlugin);
/**
 * 负责属性更新
 */
container.bind<ILayerPlugin>(TYPES.ILayerPlugin).to(UpdateStyleAttributePlugin);
/**
 * Multi Pass 自定义渲染管线
 */
container.bind<ILayerPlugin>(TYPES.ILayerPlugin).to(MultiPassRendererPlugin);
/**
 * 传入相机坐标系参数
 */
container.bind<ILayerPlugin>(TYPES.ILayerPlugin).to(ShaderUniformPlugin);
/**
 * 负责拾取过程中 Encode 以及 Highlight 阶段及结束后恢复
 */
container.bind<ILayerPlugin>(TYPES.ILayerPlugin).to(PixelPickingPlugin);

export {
  BaseLayer,
  PointLayer,
  PolygonLayer,
  Point3dLayer,
  PointImageLayer,
  LineLayer,
  Polygon3DLayer,
  ImageLayer,
  HeatMapGridLayer,
  ArcLineLayer,
  Arc2DLineLayer,
  // Line,
  // ImageLayer,
  // HeatMapLayer,
};
