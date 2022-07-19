import PointTileModel from '../../tile/models/tileModel';
import EarthExtrudeModel from './earthExtrude';
// earth
import EarthFillModel from './earthFill';
import ExtrudeModel from './extrude';
import FillModel from './fill';
import FillImageModel from './fillmage';
import IMageModel from './image';
import NormalModel from './normal';
import Radar from './radar';
import SimplePopint from './simplePoint';
import TextModel from './text';
import TileFillModel from './tile';

export type PointType =
  | 'fillImage'
  | 'fill'
  | 'radar'
  | 'image'
  | 'normal'
  | 'simplePoint'
  | 'extrude'
  | 'text'
  | 'vectorpoint'
  | 'tile'
  | 'earthFill'
  | 'earthExtrude';

const PointModels: { [key in PointType]: any } = {
  fillImage: FillImageModel,
  fill: FillModel,
  radar: Radar,
  image: IMageModel,
  normal: NormalModel,
  simplePoint: SimplePopint,
  extrude: ExtrudeModel,
  text: TextModel,
  vectorpoint: PointTileModel,
  tile: TileFillModel,
  earthFill: EarthFillModel,
  earthExtrude: EarthExtrudeModel,
};

export default PointModels;
