import LineModel from '../../line/models/line';
import ExtrudeModel from './extrude';
import FillModel from './fill';

export type PolygonModelType = 'fill' | 'extrude' | 'line';

const PolygonModels: { [key in PolygonModelType]: any } = {
  fill: FillModel,
  line: LineModel,
  extrude: ExtrudeModel,
};

export default PolygonModels;
