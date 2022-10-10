import RasterTileModel from '../../tile/models/tileModel';
import RasterModel from './raster';
import RasterRgbModel from './rasterRgb';
export type RasterModelType = 'raster' | 'raster3d' | 'rasterTile' | 'rasterRgb';

const RasterModels: { [key in RasterModelType]: any } = {
  raster: RasterModel,
  rasterRgb: RasterRgbModel,
  raster3d: RasterModel,
  rasterTile: RasterTileModel,
};

export default RasterModels;
