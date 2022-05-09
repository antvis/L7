import RasterModel from './raster';
import RasterTileModel from './raste-tile';
export type RasterModelType = 'raster' | 'raster3d' | 'rasterTile';

const RasterModels: { [key in RasterModelType]: any } = {
  raster: RasterModel,
  raster3d: RasterModel,
  rasterTile: RasterTileModel
};

export default RasterModels;
