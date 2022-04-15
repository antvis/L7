import PlaneModel from './plane';
import SpriteModel from './sprite';
export type GeometryModelType = 'plane' | 'sprite';

const GeometryModels: { [key in GeometryModelType]: any } = {
  plane: PlaneModel,
  sprite: SpriteModel,
};
export default GeometryModels;
