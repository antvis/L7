import DataImageModel from './dataImage';
import ImageModel from './image';
export type ImageModelType = 'image' | 'dataImage';

const ImageModels: { [key in ImageModelType]: any } = {
  image: ImageModel,
  dataImage: DataImageModel,
};

export default ImageModels;
