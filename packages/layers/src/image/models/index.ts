import DataImageModel from './dataImage';
import ImageModel from './image';
import TileDataImageModel from './tileDataImage';
export type ImageModelType = 'image' | 'dataImage' | 'tileDataImage';

const ImageModels: { [key in ImageModelType]: any } = {
  image: ImageModel,
  dataImage: DataImageModel,
  tileDataImage: TileDataImageModel,
};

export default ImageModels;
