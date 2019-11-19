import ExtrudeModel from './extrude';
import FillModel from './fill';

export type PolygonModelType = 'fill' | 'extrude';

const PolygonModels: { [key in PolygonModelType]: any } = {
  fill: FillModel,
  extrude: ExtrudeModel,
};

export default PolygonModels;
