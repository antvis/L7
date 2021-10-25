import ImageTileModel from './imagetile';
export type ImageTileModelType = 'imageTile';

const ImageTileModels: { [key in ImageTileModelType]: any } = {
  imageTile: ImageTileModel,
};

export default ImageTileModels;
