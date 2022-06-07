import RasterTileModel from '../../tile/models/tileModel';
import RasterModel from './raster';
export type RasterModelType =
  | 'raster'
  | 'raster3d'
  | 'rasterTile'
  | 'rasterTiff';

const RasterModels: { [key in RasterModelType]: any } = {
  raster: RasterModel,
  raster3d: RasterModel,
  rasterTile: RasterTileModel,
  rasterTiff: RasterTileModel,
};

export default RasterModels;
