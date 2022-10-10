import BillBoardModel from './billboard';
import PlaneModel from './plane';
import SpriteModel from './sprite';
export type GeometryModelType = 'plane' | 'sprite' | 'billboard';

const GeometryModels: { [key in GeometryModelType]: any } = {
  plane: PlaneModel,
  sprite: SpriteModel,
  billboard: BillBoardModel,
};
export default GeometryModels;
