import RasterTileModel from '../../tile/models/tileModel';
import RasterModel from './raster';
export type RasterModelType = 'raster' | 'raster3d' | 'rasterTile';

const RasterModels: { [key in RasterModelType]: any } = {
  raster: RasterModel,
  raster3d: RasterModel,
  rasterTile: RasterTileModel,
};

export default RasterModels;
