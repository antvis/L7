import CanvasLayer from './canvas';
import CityBuildingLayer from './citybuliding/building';
import BaseLayer from './core/BaseLayer';
import BaseModel from './core/BaseModel';
import GeometryLayer from './geometry'; // 逐步替换为 Geometry
import HeatmapLayer from './heatmap';
import ImageLayer from './image';
import LineLayer from './line/index';
import PointLayer from './point';
import PolygonLayer from './polygon';
import RasterLayer from './raster';
import TileDebugLayer from './tile/core/TileDebugLayer';

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

export function createPlugins() {
  return [
    new DataSourcePlugin(),
    new RegisterStyleAttributePlugin(),
    new FeatureScalePlugin(),
    new DataMappingPlugin(),
    new LayerStylePlugin(),
    new LayerMaskPlugin(),
    new UpdateStyleAttributePlugin(),
    new UpdateModelPlugin(),
    new MultiPassRendererPlugin(),
    new ShaderUniformPlugin(),
    new LayerAnimateStylePlugin(),
    new LightingPlugin(),
    new PixelPickingPlugin(),
    new LayerModelPlugin(),
  ];
}

export * from './core/interface';
export {
  BaseLayer,
  BaseModel,
  CanvasLayer,
  CityBuildingLayer,
  EarthLayer,
  GeometryLayer,
  HeatmapLayer,
  ImageLayer,
  LineLayer,
  MaskLayer,
  PointLayer,
  PolygonLayer,
  RasterLayer,
  TileDebugLayer,
  WindLayer,
};
