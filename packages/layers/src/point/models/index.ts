import SimplePoint from './billboard_point';
import EarthExtrudeModel from './earthExtrude';
// earth
import EarthFillModel from './earthFill';
import ExtrudeModel from './extrude';
import FillModel from './fill';
import FillImageModel from './fillImage';
import IMageModel from './image';
import NormalModel from './normal';
import Radar from './radar';
import TextModel from './text';

export type PointType =
  | 'fillImage' // 平铺
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
