import RasterModel from './raster';
import RasterRgbModel from './rasterRgb';
export type RasterModelType = 'raster' | 'raster3d' | 'rasterRgb';

const RasterModels: { [key in RasterModelType]: any } = {
  raster: RasterModel,
  rasterRgb: RasterRgbModel,
  raster3d: RasterModel,
};

export default RasterModels;
