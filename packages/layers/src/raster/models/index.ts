import RasterModel from './raster';
export type RasterModelType = 'raster' | 'raster3d';

const RasterModels: { [key in RasterModelType]: any } = {
  raster: RasterModel,
  raster3d: RasterModel,
};

export default RasterModels;
