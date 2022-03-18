import PlaneModel from './plane';
export type GeometryModelType = 'plane';

const GeometryModels: { [key in GeometryModelType]: any } = {
  plane: PlaneModel,
};
export default GeometryModels;
