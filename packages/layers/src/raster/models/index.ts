import RasterModel from './raster';
import RasterRgbModel from './rasterRgb';
import RasterTerrainRGB from './rasterTerrainRgb';
export type RasterModelType =
  | 'raster'
  | 'raster3d'
  | 'rasterRgb'
  | 'rasterTerrainRgb';

const RasterModels: { [key in RasterModelType]: any } = {
  raster: RasterModel,
  rasterRgb: RasterRgbModel,
  raster3d: RasterModel,
  rasterTerrainRgb: RasterTerrainRGB,
};

export default RasterModels;
