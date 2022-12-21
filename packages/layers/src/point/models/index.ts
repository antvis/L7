import EarthExtrudeModel from './earthExtrude';
// earth
import EarthFillModel from './earthFill';
import ExtrudeModel from './extrude';
import FillModel from './fill';
import FillImageModel from './fillmage';
import IMageModel from './image';
import NormalModel from './normal';
import Radar from './radar';
import SimplePoint from './simplePoint';
import TextModel from './text';

export type PointType =
  | 'fillImage'
  | 'fill'
  | 'radar'
  | 'image'
  | 'normal'
  | 'simplePoint'
  | 'extrude'
  | 'text'
  | 'earthFill'
  | 'earthExtrude';

const PointModels: { [key in PointType]: any } = {
  fillImage: FillImageModel,
  fill: FillModel,
  radar: Radar,
  image: IMageModel,
  normal: NormalModel,
  simplePoint: SimplePoint,
  extrude: ExtrudeModel,
  text: TextModel,
  earthFill: EarthFillModel,
  earthExtrude: EarthExtrudeModel,
};

export default PointModels;
