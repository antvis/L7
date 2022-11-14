import ImageModel from './image';
export type ImageModelType = 'image';

const ImageModels: { [key in ImageModelType]: any } = {
  image: ImageModel,
};

export default ImageModels;
